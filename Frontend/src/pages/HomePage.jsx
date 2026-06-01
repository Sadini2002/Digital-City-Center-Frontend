import HeroSection from '../components/home/HeroSection'
import CategoriesSection from '../components/home/CategoriesSection'
import FlashDealsCard from '../components/home/FlashDealsCard'
import TopShopsCard from '../components/home/TopShopsCard'
import ValuePropositionBar from '../components/home/ValuePropositionBar'

function HomePage() {
  return (
    <div className="min-w-0 overflow-x-hidden bg-white">
      <HeroSection />
      <CategoriesSection />
      <section className="bg-white py-8 sm:py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-stretch gap-5 px-3 sm:gap-6 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8">
          <FlashDealsCard />
          <TopShopsCard />
        </div>
      </section>
      <ValuePropositionBar />
    </div>
  )
}

export default HomePage
