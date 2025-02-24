import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAccount, useChainId } from 'wagmi';
import { YidengContract as YidengContractType } from '@/utils/YidengContract';
import YidengContractInterfaceABI from '@/utils/YidengContract.json';
import { Loader2 } from 'lucide-react';

const CONTRACT_ADDRESS = '0x9FD47F7E247bFd1C6BbB30Ef2f9f46E55370fFd6';

interface LoadingState {
  stake: boolean;
  unstake: boolean;
  claim: boolean;
  transfer: boolean;
  general: boolean;
}

const YidengContract = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const [contract, setContract] = useState<YidengContractType | null>(null);
  const [tokenInfo, setTokenInfo] = useState({
    name: '',
    symbol: '',
    totalSupply: '',
    balance: '',
    stakeAmount: '',
    pendingInterest: '',
  });

  const [loadingStates, setLoadingStates] = useState<LoadingState>({
    stake: false,
    unstake: false,
    claim: false,
    transfer: false,
    general: false,
  });
  const [error, setError] = useState('');

  // Form states
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  const setLoading = (key: keyof LoadingState, value: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (isConnected && window.ethereum) {
      initializeContract();
    }
  }, [isConnected, address, chainId]);

  const initializeContract = async () => {
    try {
      setLoading('general', true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        YidengContractInterfaceABI.abi,
        signer,
      );
      setContract(tokenContract as YidengContractType);
      await loadTokenInfo(tokenContract as YidengContractType);
    } catch (err: any) {
      setError('初始化合约失败: ' + err.message);
    } finally {
      setLoading('general', false);
    }
  };

  const loadTokenInfo = async (tokenContract: YidengContractType) => {
    try {
      setLoading('general', true);
      const [name, symbol, totalSupply, balance, stakeInfo, pendingInterest] = await Promise.all([
        tokenContract.name(),
        tokenContract.symbol(),
        tokenContract.totalSupply(),
        tokenContract.balanceOf(address),
        tokenContract.stakes(address),
        tokenContract.calculateInterest(address),
      ]);

      setTokenInfo({
        name,
        symbol,
        totalSupply: ethers.utils.formatEther(totalSupply),
        balance: ethers.utils.formatEther(balance),
        stakeAmount: ethers.utils.formatEther(stakeInfo.amount),
        pendingInterest: ethers.utils.formatEther(pendingInterest),
      });
    } catch (err: any) {
      setError('加载代币信息失败: ' + err.message);
    } finally {
      setLoading('general', false);
    }
  };

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading('stake', true);

    try {
      const tx = await contract?.stakeEth({
        value: ethers.utils.parseEther(stakeAmount),
      });
      await tx?.wait();
      await loadTokenInfo(contract as YidengContractType);
      setStakeAmount('');
    } catch (err: any) {
      setError('质押失败: ' + err.message);
    } finally {
      setLoading('stake', false);
    }
  };

  const handleUnstake = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading('unstake', true);

    try {
      const tx = await contract?.unstake(ethers.utils.parseEther(unstakeAmount));
      await tx?.wait();
      await loadTokenInfo(contract as YidengContractType);
      setUnstakeAmount('');
    } catch (err: any) {
      setError('赎回失败: ' + err.message);
    } finally {
      setLoading('unstake', false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading('transfer', true);

    try {
      if (!ethers.utils.isAddress(transferTo)) {
        throw new Error('无效的接收地址');
      }

      const tx = await contract?.transfer(transferTo, ethers.utils.parseEther(transferAmount));
      await tx?.wait();
      await loadTokenInfo(contract as YidengContractType);
      setTransferTo('');
      setTransferAmount('');
    } catch (err: any) {
      setError('转账失败: ' + err.message);
    } finally {
      setLoading('transfer', false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-700">欢迎使用 Yideng Token</h2>
          <p className="text-gray-500">请连接钱包以与合约交互</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError('')}
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">代币信息</h2>
          {loadingStates.general && <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">名称</p>
              <p className="text-lg font-medium">{tokenInfo.name}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">符号</p>
              <p className="text-lg font-medium">{tokenInfo.symbol}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">总供应量</p>
              <p className="text-lg font-medium">{tokenInfo.totalSupply}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">余额</p>
              <p className="text-lg font-medium">{tokenInfo.balance}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">质押数量</p>
              <p className="text-lg font-medium">{tokenInfo.stakeAmount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">质押 ETH 获得代币</h3>
          <form onSubmit={handleStake} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ETH 数量</label>
              <input
                type="number"
                step="0.01"
                value={stakeAmount}
                onChange={e => setStakeAmount(e.target.value)}
                placeholder="输入 ETH 数量"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loadingStates.stake}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loadingStates.stake && <Loader2 className="w-5 h-5 animate-spin" />}
              <span>质押</span>
            </button>
          </form>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">赎回ETH</h3>
          <form onSubmit={handleUnstake} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">代币数量</label>
              <input
                type="number"
                step="0.01"
                value={unstakeAmount}
                onChange={e => setUnstakeAmount(e.target.value)}
                placeholder="输入代币数量"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loadingStates.unstake}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loadingStates.unstake && <Loader2 className="w-5 h-5 animate-spin" />}
              <span>赎回</span>
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">转账</h3>
        <form onSubmit={handleTransfer} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">接收地址</label>
            <input
              type="text"
              value={transferTo}
              onChange={e => setTransferTo(e.target.value)}
              placeholder="输入接收地址"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
            />
            <label className="block text-sm font-medium text-gray-700 mb-2">转账数量</label>
            <input
              type="number"
              step="0.01"
              value={transferAmount}
              onChange={e => setTransferAmount(e.target.value)}
              placeholder="输入转账数量"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loadingStates.transfer}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loadingStates.transfer && <Loader2 className="w-5 h-5 animate-spin" />}
            <span>转账</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default YidengContract;
