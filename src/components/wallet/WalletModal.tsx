import Modal from '../modals/Modal'
import dynamic from 'next/dynamic'

const NoSSRWalletInterface = dynamic(() => import('./WalletInterface'), {
  ssr: false,
})

export default function WalletModal({ close }: { close: () => void }) {
  return (
    <Modal close={close} className="w-96">
      <div className="p-4">
        <p className="text-2xl text-center text-black md:text-3xl">
          {' '}
          Payment Method
        </p>
      </div>
      <NoSSRWalletInterface onWalletConnected={close} />
    </Modal>
  )
}
