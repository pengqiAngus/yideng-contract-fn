import { Link, useLocation } from 'react-router-dom';
import WalletConnectButton from '../connectCard/ConnectButton';
import { hooks, metaMask } from '@/connectors/metaMask';
import { Accounts } from '../connectCard/Accounts';
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = hooks;
const Header = () => {
  const accounts = useAccounts();
  const provider = useProvider();
  const ENSNames = useENSNames(provider);
  const location = useLocation();

  const isActive = path => {
    return location.pathname === path;
  };

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg transition-colors ${
        isActive(to) ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left side navigation */}
        <nav className="flex items-center space-x-4">
          <NavLink to="/">HomePage</NavLink>
          <NavLink to="/dapp">Dapp</NavLink>
          <NavLink to="/yideng/async-test">asyncTest</NavLink>
        </nav>
        <Accounts accounts={accounts} provider={provider} ENSNames={ENSNames} />
        {/* Right side wallet button */}
        <WalletConnectButton />
      </div>
    </header>
  );
};

export default Header;
