// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract YidengContract {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    
    // 代币兑换比例：1 ETH = 10000 token
    uint256 public constant EXCHANGE_RATE = 10000;
    // 利息率：每100个token每天增加1个token
    uint256 public constant INTEREST_RATE = 1;
    uint256 public constant INTEREST_BASE = 100;
    uint256 public constant SECONDS_PER_DAY = 86400;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => uint256) public ethBalance;
    
    // 用户质押信息
    struct StakeInfo {
        uint256 amount;          // 质押的token数量
        uint256 stakingTime;     // 质押开始时间
        uint256 lastInterestCalculationTime;  // 上次计算利息的时间
    }
    
    mapping(address => StakeInfo) public stakes;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    event EthDeposited(address indexed from, uint256 amount);
    event EthWithdrawn(address indexed to, uint256 amount);
    event Staked(address indexed user, uint256 ethAmount, uint256 tokenAmount);
    event Unstaked(address indexed user, uint256 tokenAmount, uint256 ethAmount);
    event InterestEarned(address indexed user, uint256 amount);
    
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals
    ) {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_symbol).length > 0, "Symbol cannot be empty");
        require(_decimals > 0, "Decimals must be greater than 0");
        
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
    }
    
    // 确保合约可以接收 ETH
    receive() external payable {}
    fallback() external payable {}
    
    // 质押ETH获取代币
    function stakeEth() external payable {
        require(msg.value > 0, "Must send ETH");
        
        // 计算可获得的代币数量
        uint256 tokenAmount = msg.value * EXCHANGE_RATE;
        
        // 铸造代币
        totalSupply += tokenAmount;
        balanceOf[msg.sender] += tokenAmount;
        
        // 更新质押信息
        stakes[msg.sender] = StakeInfo({
            amount: tokenAmount,
            stakingTime: block.timestamp,
            lastInterestCalculationTime: block.timestamp
        });
        
        emit Staked(msg.sender, msg.value, tokenAmount);
        emit TokensMinted(msg.sender, tokenAmount);
    }
    
    // 计算当前可获得的利息
    function calculateInterest(address user) public view returns (uint256) {
        StakeInfo memory stakeInfo = stakes[user];
        if (stakeInfo.amount == 0) {
            return 0;
        }
        
        uint256 daysPassed = (block.timestamp - stakeInfo.lastInterestCalculationTime) / SECONDS_PER_DAY;
        if (daysPassed == 0) {
            return 0;
        }
        
        return (stakeInfo.amount / INTEREST_BASE) * INTEREST_RATE * daysPassed;
    }
    
    // 领取利息
    function claimInterest() external {
        uint256 interest = calculateInterest(msg.sender);
        require(interest > 0, "No interest to claim");
        
        stakes[msg.sender].lastInterestCalculationTime = block.timestamp;
        
        totalSupply += interest;
        balanceOf[msg.sender] += interest;
        
        emit InterestEarned(msg.sender, interest);
        emit TokensMinted(msg.sender, interest);
    }
    
    // 赎回token换取ETH
    function unstake(uint256 tokenAmount) external {
        require(tokenAmount > 0, "Amount must be greater than 0");
        require(balanceOf[msg.sender] >= tokenAmount, "Insufficient balance");
        
        // 先领取未结算的利息
        uint256 interest = calculateInterest(msg.sender);
        if (interest > 0) {
            totalSupply += interest;
            balanceOf[msg.sender] += interest;
            emit InterestEarned(msg.sender, interest);
            emit TokensMinted(msg.sender, interest);
        }
        
        uint256 ethAmount = tokenAmount / EXCHANGE_RATE;
        require(address(this).balance >= ethAmount, "Insufficient contract ETH balance");
        
        balanceOf[msg.sender] -= tokenAmount;
        totalSupply -= tokenAmount;
        
        if (stakes[msg.sender].amount <= tokenAmount) {
            delete stakes[msg.sender];
        } else {
            stakes[msg.sender].amount -= tokenAmount;
            stakes[msg.sender].lastInterestCalculationTime = block.timestamp;
        }
        
        (bool success, ) = msg.sender.call{value: ethAmount}("");
        require(success, "ETH transfer failed");
        
        emit Unstaked(msg.sender, tokenAmount, ethAmount);
        emit TokensBurned(msg.sender, tokenAmount);
    }
    
    // 转账功能
    function transfer(address to, uint256 amount) external returns (bool) {
        require(to != address(0), "Invalid recipient");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        
        uint256 interest = calculateInterest(msg.sender);
        if (interest > 0) {
            totalSupply += interest;
            balanceOf[msg.sender] += interest;
            emit InterestEarned(msg.sender, interest);
            emit TokensMinted(msg.sender, interest);
        }
        
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        
        emit Transfer(msg.sender, to, amount);
        return true;
    }
}