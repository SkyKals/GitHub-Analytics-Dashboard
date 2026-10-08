import DashboardLayout from '../../components/layout/DashboardLayout'
import Counter from '../../components/widgets/Counter'
import Toggle from '../../components/widgets/Toggle'
import FilteredList from '../../features/repositories/components/FilteredList'
import { repositories } from '../../features/repositories/data/repositories.mock'
import { getRepositoryCount, getTotalForks, getTotalStars } from '../../features/repositories/model/selectors'
import DashboardHeader from './components/DashboardHeader'
import RepositoryKpis from './components/RepositoryKpis'

export default function DashboardPage() {
  const totalStars = getTotalStars(repositories)
  const totalForks = getTotalForks(repositories)
  const repositoryCount = getRepositoryCount(repositories)

  return (
    <DashboardLayout>
      <DashboardHeader />
      <RepositoryKpis
        totalStars={totalStars}
        totalForks={totalForks}
        repositoryCount={repositoryCount}
      />
      <Counter initialValue={0} />
      <Toggle />
      <FilteredList repositories={repositories} />
    </DashboardLayout>
  )
}
