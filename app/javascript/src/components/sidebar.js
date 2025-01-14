import React, { useState, useEffect } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Tooltip from 'rc-tooltip'

import icon from '../images/favicon.png'
import FilterMenu from '../components/FilterMenu'
import { signout } from '../actions/auth'
import WebSetup from '../components/webSetup'
import LangChooser from '../components/LangChooser'
import Toggle from '../components/forms/Toggle'
import {
  MoreIcon,
  BookMarkIcon,
  MessageBubbleIcon,
  ConversationIcon,

  FlagIcon,
  LoadBalancerIcon,
  FactoryIcon,
  ShuffleIcon,

  BuildingIcon,
  IntegrationsIcon,
  WebhooksIcon,
  TeamIcon,
  SettingsIcon,
  FolderIcon,
  UserWalkIcon,
  UserIcon,
  TourIcon,
  MessageIcon,
  EmailIcon,
  ApiIcon,
  CardIcon,
  SeachIcon
} from '../components/icons'

import SidebarAgents from '../components/conversations/SidebarAgents'

import { toggleDrawer } from '../actions/drawer'

import I18n from '../shared/FakeI18n'

import {
  UPDATE_AGENT
} from '../graphql/mutations'
import graphql from '../graphql/client'
import { getCurrentUser } from '../actions/current_user'

function mapStateToProps (state) {
  const {
    auth,
    drawer,
    app,
    segment,
    app_users,
    current_user,
    navigation
  } = state
  const { loading, isAuthenticated } = auth
  return {
    segment,
    app_users,
    current_user,
    app,
    loading,
    isAuthenticated,
    navigation,
    drawer
  }
}

function Sidebar ({
  app,
  match,
  dispatch,
  navigation,
  current_user,
  drawer,
  history
}) {
  const { current_page, current_section } = navigation

  const [expanded, setExpanded] = useState(current_section)
  const [loading, setLoading] = useState(false)

  const [langChooser, setLangChooser] = useState(false)

  const routerListener = null

  useEffect(() => {
    setExpanded(current_section)
  }, [current_section])

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  function isActivePage (page) {
    /// console.log("selected page", current_page , page)
    return current_page === page
  }

  function handleSignout () {
    dispatch(signout())
  }

  const appid = `/apps/${app.key}`

  const categories = [
    {
      id: 'Dashboard',
      label: I18n.t('navigator.dashboard'),
      icon: <BuildingIcon style={{ fontSize: 30 }} />,
      url: `/apps/${app.key}`,
      hidden: true,
      children: [
        /* {
          id: 'campaigns', label: 'Mailing Campaigns',
          icon: <EmailIcon/>,
          url: `${appid}/messages/campaigns`,
          active: isActivePage("campaigns")
        } */
        {
          render: (props) => [
            <div key={'dashboard-hey'}>
              <p className="text-xs leading-5 text-gray-500 font-light"
                dangerouslySetInnerHTML={
                  { __html: I18n.t('dashboard.hey', { name: app.name }) }
                }/>
              <WebSetup />
            </div>
          ]
        }
      ]
    },
    {
      id: 'Platform',
      label: I18n.t('navigator.platform'),
      icon: <FactoryIcon style={{ fontSize: 30 }} />,
      url: `/apps/${app.key}/segments/${
        app.segments ? app.segments[0].id : ''
      }`,
      children: app.segments.map((o) => ({
        id: o.name,
        icon: null,
        url: `/apps/${app.key}/segments/${o.id}`,
        active: isActivePage(`segment-${o.id}`)
      }))
    },
    {
      id: 'Conversations',
      label: I18n.t('navigator.conversations'),
      icon: <ConversationIcon style={{ fontSize: 30 }} />,
      url: `/apps/${app.key}/conversations`,
      children: [
        {
          id: 'Conversations',
          label: I18n.t('navigator.childs.conversations'),
          icon: <MessageBubbleIcon />,
          url: `/apps/${app.key}/conversations`,
          active: isActivePage('Conversations')
        },
        {
          id: 'Assignment Rules',
          icon: <ShuffleIcon />,
          label: I18n.t('navigator.childs.assignment_rules'),
          url: `/apps/${app.key}/conversations/assignment_rules`,
          active: isActivePage('Assignment Rules')
        },
        {
          render: () => [
            <SidebarAgents/>
          ]
        }
      ]
    },
    {
      id: 'Campaigns',
      label: I18n.t('navigator.campaigns'),
      url: `/apps/${app.key}/campaigns`,
      icon: <FlagIcon style={{ fontSize: 30 }} />,
      children: [
        {
          id: 'campaigns',
          label: I18n.t('navigator.childs.mailing_campaigns'),
          icon: <EmailIcon />,
          url: `${appid}/messages/campaigns`,
          active: isActivePage('campaigns')
        },
        {
          id: 'user_auto_messages',
          label: I18n.t('navigator.childs.in_app_messages'),
          icon: <MessageIcon />,
          url: `${appid}/messages/user_auto_messages`,
          active: isActivePage('user_auto_messages')
        },
        {
          id: 'tours',
          label: I18n.t('navigator.childs.guided_tours'),
          icon: <TourIcon />,
          url: `${appid}/messages/tours`,
          active: isActivePage('tours')
        }
      ]
    },

    {
      id: 'Bot',
      label: I18n.t('navigator.routing_bots'),
      icon: <LoadBalancerIcon style={{ fontSize: 30 }} />,
      url: `/apps/${app.key}/bots/settings`,
      children: [
        {
          id: 'For Leads',
          label: I18n.t('navigator.childs.for_leads'),
          icon: <UserWalkIcon />,
          url: `${appid}/bots/leads`,
          active: isActivePage('botleads')
        },
        {
          id: 'For Users',
          label: I18n.t('navigator.childs.for_users'),
          icon: <UserIcon />,
          url: `${appid}/bots/users`,
          active: isActivePage('botusers')
        },
        {
          id: 'Settings',
          label: I18n.t('navigator.childs.bot_settings'),
          icon: <SettingsIcon />,
          url: `${appid}/bots/settings`,
          active: isActivePage('botSettings')
        }
      ]
    },

    {
      label: I18n.t('navigator.help_center'),
      id: 'HelpCenter',
      icon: <BookMarkIcon style={{ fontSize: 30 }} />,
      url: `/apps/${app.key}/articles`,
      children: [
        {
          id: 'Articles',
          label: I18n.t('navigator.childs.articles'),
          icon: <BookMarkIcon />,
          url: `/apps/${app.key}/articles`,
          active: isActivePage('Articles')
        },
        {
          id: 'Collections',
          label: I18n.t('navigator.childs.collections'),
          icon: <FolderIcon />,
          url: `/apps/${app.key}/articles/collections`,
          active: isActivePage('Collections')
        },
        {
          id: 'Settings',
          label: I18n.t('navigator.childs.article_settings'),
          icon: <SettingsIcon />,
          url: `/apps/${app.key}/articles/settings`,
          active: isActivePage('Settings')
        }
      ]
    },


    {
      id: 'Settings',
      label: I18n.t('navigator.settings'),
      icon: <SettingsIcon style={{ fontSize: 30 }} />,
      url: `/apps/${app.key}/settings`,
      children: [
        {
          id: 'App Settings',
          label: I18n.t('navigator.childs.app_settings'),
          icon: <SettingsIcon />,
          url: `/apps/${app.key}/settings`,
          active: isActivePage('app_settings')
        },

        {
          id: 'Messenger',
          label: I18n.t('navigator.childs.messenger_settings'),
          icon: <MessageIcon />,
          url: `/apps/${app.key}/messenger`,
          active: isActivePage('messenger')
        },

        {
          id: 'Team',
          label: I18n.t('navigator.childs.team'),
          icon: <TeamIcon />,
          url: `/apps/${app.key}/team`,
          active: isActivePage('team')
        },
        {
          id: 'Integrations',
          label: I18n.t('navigator.childs.integrations'),
          icon: <IntegrationsIcon />,
          url: `/apps/${app.key}/integrations`,
          active: isActivePage('integrations')
        },
        {
          id: 'Webhooks',
          label: I18n.t('navigator.childs.webhooks'),
          icon: <WebhooksIcon />,
          url: `/apps/${app.key}/webhooks`,
          active: isActivePage('webhooks')
        },
        {
          id: 'Api access',
          label: I18n.t('navigator.childs.api_access'),
          icon: <ApiIcon />,
          url: `/apps/${app.key}/oauth_applications`,
          active: isActivePage('oauth_applications')
        },
        {
          id: 'Billing',
          icon: <CardIcon />,
          hidden: !app.subscriptionsEnabled,
          url: `/apps/${app.key}/billing`,
          active: isActivePage('billing')
        }
        // { id: 'Authentication', icon: <ShuffleIcon />, active: isActivePage("user_auto_messages")},
      ]
    }
  ]

  function handleDrawer () {
    dispatch(toggleDrawer({ open: !drawer.open }))
  }

  function renderInner () {
    return categories
      .filter((o) => o.id === current_section)
      .map(({ id, label, icon, children }) => {
        //  expanded={expanded === id}
        return (
          <div
            key={`sidebar-section-${id}`}
            className="h-0-- flex-1 flex flex-col pt-5 pb-4 overflow-y-auto"
          >
            <div className="flex items-center flex-shrink-0 px-4
              text-lg leading-6 font-bold text-gray-900">
              <h3 className="font-bold w-full">{label}</h3>
            </div>
            <nav className="mt-5 flex-1 px-4">
              {children.filter((o)=> !o.hidden ).map(
                ({ id: childId, label, icon, active, url, onClick, render }) =>
                  !render ? (
                    <Link
                      key={`sidebar-section-child-${id}-${childId}`}
                      to={url}
                      className={`
                        ${
                          active ? 'bg-white' : ''
                        } hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-200
                        group flex items-center px-2 py-2 text-sm leading-5 font-medium text-gray-900 
                        rounded-md transition ease-in-out duration-150`}
                    >
                      {/* <svg className="mr-3 h-6 w-6 text-gray-500 group-hover:text-gray-500 group-focus:text-gray-600 transition ease-in-out duration-150" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10M9 21h6"/>
                          </svg> */}
                      <div className="mr-3 h-6 w-6 text-gray-500 group-hover:text-gray-500 group-focus:text-gray-600 transition ease-in-out duration-150">
                        {icon}
                      </div>

                      {label || childId}
                    </Link>
                  ) : (
                    render()
                  )
              )}
            </nav>
          </div>
        )
      })
  }

  function openLangChooser () {
    setLangChooser(true)
  }

  function handleAwaymode (e) {
    setLoading(true)

    graphql(UPDATE_AGENT, {
      appKey: app.key,
      email: current_user.email,
      params: {
        available: !current_user.available
      }
    }, {
      success: (data) => {
        dispatch(getCurrentUser())
        setLoading(false)
      },
      error: () => {
        setLoading(false)
      }
    })
  }

  const drawerClass = !drawer.open
    ? 'hidden'
    : 'absolute flex md:flex-shrink-0 z-50 h-screen'

  return (
    <div className={`${drawerClass} md:flex md:flex-shrink-0`}>
      {app && (
        <div
          className={
            `md:block border-r 
            bg-gray-200 
            text-purple-lighter 
            flex-none w-23 
            p-2 
            overflow-y-auto--`
          }
        >
          <div className="cursor-pointer mb-4">
            <div className="bg-white h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-lg mb-1 overflow-hidden">
              <Link to={'/apps'}>
                <img src={icon} alt="" />
              </Link>
            </div>
          </div>

          <div className="overflow-y-auto h-full">
            {categories.map((o) => (
              <Tooltip
                key={`sidebar-categories-${o.id}`}
                placement="right"
                overlay={o.label}
              >
                <div
                  className="cursor-pointer mb-4 p-3
                          bg-gray-200 hover:bg-gray-100 rounded-md"
                >
                  {o.url && (
                    <Link
                      to={`${o.url}`}
                      aria-label={o.label}
                      className="bg-indigo-lighter
                      h-12 w-12 flex-- items-center
                      justify-center-- text-black
                      text-2xl font-semibold rounded-lg
                      mb-1 overflow-hidden text-gray-400"
                    >
                      {o.icon}
                    </Link>
                  )}
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
      )}

      { langChooser &&
        <LangChooser
          open={langChooser}
          handleClose={setLangChooser}
        />
      }

      <div className="md:flex flex-col w-56 border-r border-gray-200 bg-gray-100 shadow-inner">
        {renderInner()}

        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <a href="#" className="flex-shrink-0 group block focus:outline-none">
            <div className="flex items-center">
              <div>
                <img
                  className="inline-block h-9 w-9 rounded-full"
                  src={current_user.avatarUrl}
                  alt=""
                  width={40}
                  height={40}
                />
              </div>
              <div className="ml-3 w-2/5 flex flex-wrap">
                <p className="text-sm leading-5 font-medium text-gray-700 group-hover:text-gray-900 truncate">
                  {current_user.email}
                </p>


                <div className="flex items-center">
                  <Toggle
                    id="user-away-mode-toggle"
                    text={
                      <span className="text-xs text-gray-500">
                        Away mode
                      </span>
                    }
                    checked={current_user.available}
                    disabled={loading}
                    onChange={handleAwaymode}
                  />

                  <FilterMenu
                    options={[
                      {
                        title: I18n.t('navigator.user_menu.create_app'),
                        description: I18n.t('navigator.user_menu.create_app_description'),
                        // icon: <SendIcon />,
                        id: 'new-app',
                        onClick: () => history.push('/apps/new')
                      },

                      {
                        id: 'choose-lang',
                        title: I18n.t('home.choose_lang'),
                        onClick: openLangChooser
                      },
                      {
                        title: I18n.t('navigator.user_menu.signout'),
                        // description: "delivers the campaign",
                        // icon: <SendIcon />,
                        id: 'sign-out',
                        onClick: handleSignout
                      }
                    ]}
                    value={null}
                    filterHandler={(e) => e.onClick && e.onClick() }
                    triggerButton={(handler) => (
                      <button
                        onClick={handler}
                        id="user_menu"
                        className="text-xs leading-4 font-medium text-gray-500 group-hover:text-gray-700 group-focus:underline transition ease-in-out duration-150">
                        <div className="flex items-center">
                          {/*
                            I18n.t('navigator.user_menu.title')
                          */}
                          <MoreIcon/>
                        </div>

                      </button>
                    )}
                    position={'left'}
                    origin={'bottom-0'}
                  />
                </div>

              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default withRouter(connect(mapStateToProps)(Sidebar))
