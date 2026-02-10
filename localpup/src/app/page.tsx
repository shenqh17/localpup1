import { Hero } from '@/components/Hero'
import { FeaturedHotels } from '@/components/FeaturedHotels'
import { Features } from '@/components/Features'
import { CityGuide } from '@/components/CityGuide'
import { Newsletter } from '@/components/Newsletter'

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <FeaturedHotels />
      <CityGuide />
      <Newsletter />
    </>
  )
}