import { UserCircleIcon } from '@heroicons/react/solid'
import { useWeb3React } from '@web3-react/core'
import classNames from 'classnames'
import A from 'components/A'
import useDID from 'components/useDID'
import { useRouter } from 'next/dist/client/router'
import { useRef, useState } from 'react'
import useOnClickOutside from 'utils/useOnClickOutside'

export default function WalletStatus({ openModal }: { openModal: () => void }) {
  const { active, deactivate } = useWeb3React()
  const router = useRouter()

  const ref = useRef()
  const [isOpen, setIsOpen] = useState(false)

  useOnClickOutside(ref, () => setIsOpen(false))

  const isDIDActive = useDID()

  return (
    <div className="flex flex-row items-center cursor-pointer justify-self-end">
      {active && isDIDActive ? (
        <div>
          <div
            className="flex items-center text-white whitespace-nowrap cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <UserCircleIcon className="w-5 h-5 fill-current text-green-400" />
            <span className="ml-2">Connected</span>
          </div>
          <div
            ref={ref}
            className={classNames(
              'relative z-20 transition-all origin-top-right transform scale-95 -translate-y-0 bg-white dropdown-menu',
              isOpen ? 'visible' : 'invisible'
            )}
          >
            <div className="absolute -left-10 w-48 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none">
              <A
                onClick={() => {
                  router.push('/profile')
                  setIsOpen(false)
                }}
                className="flex flex-row items-center w-full px-2 py-4 space-x-2 leading-5 transition-colors transform hover:bg-gray-100 hover:cursor-pointer"
              >
                Profile
              </A>
              <A
                onClick={() => {
                  openModal()
                  setIsOpen(false)
                }}
                className="flex flex-row items-center w-full px-2 py-4 space-x-2 leading-5 transition-colors transform hover:bg-gray-100 hover:cursor-pointer"
              >
                Wallet
              </A>
              <A
                onClick={() => {
                  deactivate()
                  setIsOpen(false)
                }}
                className="flex flex-row items-center w-full px-2 py-4 space-x-2 leading-5 transition-colors transform hover:bg-gray-100 hover:cursor-pointer"
              >
                Disconnect
              </A>
            </div>
          </div>
        </div>
      ) : (
        <>
          <UserCircleIcon className="w-5 h-5 fill-current text-red-400" />
          <div onClick={openModal} className="ml-3 text-white align-middle whitespace-nowrap">
            Connect
          </div>
        </>
      )}
    </div>
  )
}
