import {Navigate, Route, Routes, Outlet} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'


const widgetsBreadCrumbs: Array<PageLink> = [
  {
    title: 'Widgets',
    path: '/crafted/widgets/charts',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const WidgetsPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='charts'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs}>Charts</PageTitle>
            </>
          }
        />
        <Route
          path='feeds'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs}>Feeds</PageTitle>

            </>
          }
        />
        <Route
          path='lists'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs}>Lists</PageTitle>

            </>
          }
        />
        <Route
          path='mixed'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs}>Mixed</PageTitle>

            </>
          }
        />
        <Route
          path='tables'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs}>Tables</PageTitle>

            </>
          }
        />
        <Route
          path='statistics'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs}>Statiscics</PageTitle>

            </>
          }
        />
        <Route index element={<Navigate to='/crafted/widgets/lists' />} />
      </Route>
    </Routes>
  )
}

export default WidgetsPage
