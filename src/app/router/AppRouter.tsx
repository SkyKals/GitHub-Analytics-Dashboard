import { BrowserRouter, Route, Routes } from 'react-router'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardPage from '../../pages/dashboard/DashboardPage'
import NotFoundPage from '../../pages/not-found/NotFoundPage'
import RepositoryDetailsPage from '../../pages/repository-details/RepositoryDetailsPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/repository/:owner/:repo" element={<RepositoryDetailsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  )
}
