import React, { useEffect, useState, Fragment } from 'react'
import LoginButton from './components/LoginButton'
import LogoutButton from './components/LogoutButton'
import { useAuth0 } from '@auth0/auth0-react'
import { Listbox, Transition, Disclosure, Menu } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { BellIcon, UserIcon } from '@heroicons/react/outline'

export default function App() {
  const {user, loginWithRedirect} = useAuth0();
  const [organization, setOrganization] = useState();
  const [email, setEmail] = useState();
  const [organizations, setOrganizations] = useState();
  const [profileImage, setProfileImage] = useState();

  useEffect(() => {
    if (organizations) {
      if (organizations.length > 1) {
        setOrganization(organizations[0]);
      } else {
        loginWithRedirect({organization: organizations[0].id, login_hint: email});
      }
    }
  }, [organizations]);

  useEffect(() => {
    if (user) {
      getOrg(user.org_id);
      setProfileImage(user.picture)
    } else {
      setProfileImage(undefined);
    }
  }, [user]);

  const getOrgs = () => {
    console.log(process.env.REACT_APP_API_BASE_URL);
    fetch(process.env.REACT_APP_API_BASE_URL + 'user-orgs-by-email?email=' + email)
    .then(response => response.json())
    .then(data => data.length > 0 ? setOrganizations(data) : loginWithRedirect({login_hint: email}));
  }

  const getOrg = () => {
    fetch(process.env.REACT_APP_API_BASE_URL + 'org-by-id?org_id=' + user.org_id)
    .then(response => response.json())
    .then(data => setOrganization(data));
  }

  const goBack = () => {
    setOrganization(undefined);
    setOrganizations(undefined);
  }
 
  const handleSubmit = (evt) => {
    evt.preventDefault();
    getOrgs();
  }

  const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ')
  }

  const navigation = [
    { name: 'Dashboard', href: '#', current: true },
    // { name: 'Team', href: '#', current: false },
    // { name: 'Projects', href: '#', current: false },
    // { name: 'Calendar', href: '#', current: false },
  ]
  
  return (
    <>
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <img
                    className="block lg:hidden h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                    alt="Workflow"
                  />
                  <img
                    className="hidden lg:block h-8 w-auto"
                    src={organization && user ? organization.branding.logo_url : "https://i.ibb.co/SwxJtJw/Screen-Shot-2022-04-18-at-12-02-48-PM-removebg-preview.png"}
                    alt="Workflow"
                  />
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'px-3 py-2 rounded-md text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white text-gray-400 hover:text-white">
                      <span className="sr-only">Open user menu</span>
                      {profileImage ? <img
                        className="h-8 w-8 rounded-full"
                        src={profileImage}
                        alt=""
                      /> :
                      <UserIcon className="h-6 w-6" aria-hidden="true"/>}
                      
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
    <br></br>
    <br></br>
    <div style={{width:"300px", margin:"0 auto"}}>
      {!user && !organization &&
        <>
          <form onSubmit={handleSubmit}>
            <div class="mb-6">
              <label for="email" class="block mb-2 text-sm font-medium text-black-900 dark:text-black-300">Email:</label>
              <input type="email" onChange={e => setEmail(e.target.value)} id="email" class="bg-white-50 border border-gray-300 text-black-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@team0.com" required/>
            </div>
            <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
          </form>
          <br></br>
          <br></br>
        </>
      }
      {organizations && organization &&
        <>
          <Listbox value={organization} onChange={setOrganization}>
            {({ open }) => (
              <>
                <Listbox.Label className="block text-sm font-medium text-gray-700">Team:</Listbox.Label>
                <div className="mt-1 relative">
                  <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <span className="flex items-center">
                      <img src={organization.branding.logo_url} alt="" className="flex-shrink-0 h-6 w-6 rounded-full" />
                      <span className="ml-3 block truncate">{organization.display_name}</span>
                    </span>
                    <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      {organizations.map((org) => (
                        <Listbox.Option
                          key={org.id}
                          className={({ active }) =>
                            classNames(
                              active ? 'text-white bg-indigo-600' : 'text-gray-900',
                              'cursor-default select-none relative py-2 pl-3 pr-9'
                            )
                          }
                          value={org}
                        >
                          {({ selected, active }) => (
                            <>
                              <div className="flex items-center">
                                <img src={org.branding.logo_url} alt="" className="flex-shrink-0 h-6 w-6 rounded-full" />
                                <span
                                  className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                >
                                  {org.display_name}
                                </span>
                              </div>

                              {selected ? (
                                <span
                                  className={classNames(
                                    active ? 'text-white' : 'text-indigo-600',
                                    'absolute inset-y-0 right-0 flex items-center pr-4'
                                  )}
                                >
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
          <br></br>
          <div>
            <button class="text-white bg-red-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" onClick={() => goBack()} style={{display: 'inline-block', marginRight: 10}}>Back</button>
            <LoginButton organization={organization.id} email={email}/>
          </div>
        </>
      }
      {user &&
        <div style={{margin: 'auto'}}>
          <div class="relative shadow-md sm:rounded-lg">
              <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                          <th scope="col" class="px-6 py-3">
                              First Name
                          </th>
                          <th scope="col" class="px-6 py-3">
                              Email
                          </th>
                          <th scope="col" class="px-6 py-3">
                              Team Name
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <th scope="row" class="px-12 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                            {user.nickname}
                          </th>
                          <td class="px-6 py-4 dark:text-white whitespace-nowrap font-medium">
                            {user.email}
                          </td>
                          <td class="px-12 py-4 dark:text-white whitespace-nowrap font-medium">
                            {organization ? organization.display_name : ''}
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
          <br></br>
          <LogoutButton />
        </div>
      }
    </div>
    </>
  )
}