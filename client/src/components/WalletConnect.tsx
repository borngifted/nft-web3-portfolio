/**
 * DESIGN PHILOSOPHY: Digital Noir - Cinematic Brutalism
 * Wallet connection button with RainbowKit integration
 */

import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function WalletConnect() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="text-mono text-xs hover:text-primary transition-colors scanline"
                  >
                    CONNECT
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    className="text-mono text-xs text-destructive hover:text-destructive/80 transition-colors"
                  >
                    WRONG NETWORK
                  </button>
                );
              }

              return (
                <div className="flex gap-4">
                  <button
                    onClick={openChainModal}
                    className="text-mono text-xs hover:text-primary transition-colors"
                  >
                    {chain.hasIcon && chain.iconUrl && (
                      <img
                        alt={chain.name ?? 'Chain icon'}
                        src={chain.iconUrl}
                        className="w-3 h-3 inline-block mr-1"
                      />
                    )}
                    {chain.name}
                  </button>

                  <button
                    onClick={openAccountModal}
                    className="text-mono text-xs hover:text-primary transition-colors scanline"
                  >
                    {account.displayName}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
