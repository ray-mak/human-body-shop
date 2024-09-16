"use client"
import {
  faArrowLeftLong,
  faArrowRightLong,
  faQuoteLeft,
  faQuoteRight,
  faStar,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from "react"

const reviews = [
  {
    id: 1,
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptatem, quos, quas dolorum, voluptatibus quidem",
    author: "John Doe",
  },
  {
    id: 2,
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptatem, quos, quas dolorum, voluptatibus quidem",
    author: "Jane Smith",
  },
  {
    id: 3,
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptatem, quos, quas dolorum, voluptatibus quidem",
    author: "Robert Johnson",
  },
  {
    id: 4,
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptatem, quos, quas dolorum, voluptatibus quidem",
    author: "Emily Davis",
  },
  {
    id: 5,
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptatem, quos, quas dolorum, voluptatibus quidem",
    author: "Robert Smith",
  },
  {
    id: 6,
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptatem, quos, quas dolorum, voluptatibus quidem",
    author: "Emily Smith",
  },
]
const ReviewsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerSlide, setItemsPerSlide] = useState(1)

  const nextSlide = () => {
    setCurrentIndex((index) => {
      if (index === reviews.length / itemsPerSlide - 1) {
        return 0
      } else {
        return index + 1
      }
    })
  }

  const prevSlide = () => {
    setCurrentIndex((index) => {
      if (index === 0) {
        return reviews.length / itemsPerSlide - 1
      } else {
        return index - 1
      }
    })
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setItemsPerSlide(2)
      } else {
        setItemsPerSlide(1)
      }
    }

    window.addEventListener("resize", handleResize)

    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const chunkReviews = (reviews: any, itemsPerSlide: number) => {
    const chunked = []
    for (let i = 0; i < reviews.length; i += itemsPerSlide) {
      chunked.push(reviews.slice(i, i + itemsPerSlide))
    }
    return chunked
  }

  const chunkedReviews = chunkReviews(reviews, itemsPerSlide)

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-8">
      <div className="flex gap-4 items-center">
        <div className="w-20 h-[2px] bg-mutedTeal"></div>
        <h2 className="text-4xl font-medium text-center">
          What People Are Saying
        </h2>
        <div className="w-20 h-[2px] bg-mutedTeal"></div>
      </div>
      <div className="relative w-full md:w-5/6 lg:w-3/4 lg:max-w-6xl px-24 md:px-0">
        <button
          className="absolute top-1/2 left-8 md:-left-12 lg:-left-20"
          onClick={prevSlide}
          aria-label="see previous slide of reviews"
        >
          <FontAwesomeIcon icon={faArrowLeftLong} size="xl" />
        </button>
        <button
          className="absolute top-1/2 right-8 md:-right-12 lg:-right-20"
          onClick={nextSlide}
          aria-label="see next slide of reviews"
        >
          <FontAwesomeIcon icon={faArrowRightLong} size="xl" />
        </button>

        <div className="relative flex w-full overflow-hidden">
          {chunkedReviews.map((reviewSet, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex-grow-0 w-full grid grid-cols-1 md:grid-cols-2 gap-10"
              style={{
                translate: `${-100 * currentIndex}%`,
                transition: "translate 300ms",
              }}
            >
              {reviewSet.map((review: any) => (
                <div
                  key={review.id}
                  className="relative flex flex-col items-center gap-4 border rounded-lg shadow-lg p-8 "
                >
                  <div className="absolute left-3 top-3 opacity-40">
                    <FontAwesomeIcon
                      icon={faQuoteLeft}
                      className="text-4xl text-mutedTeal dark:text-darkTeal"
                    />
                  </div>
                  <div className="absolute right-3 top-3 opacity-40">
                    <FontAwesomeIcon
                      icon={faQuoteRight}
                      className="text-4xl text-mutedTeal dark:text-darkTeal"
                    />
                  </div>
                  <p className="text-center text-gray-600 text-sm dark:text-gray-200">
                    {review.text}
                  </p>
                  <div className="flex gap-1">
                    <FontAwesomeIcon
                      icon={faStar}
                      style={{ color: "#FFD43B" }}
                    />
                    <FontAwesomeIcon
                      icon={faStar}
                      style={{ color: "#FFD43B" }}
                    />
                    <FontAwesomeIcon
                      icon={faStar}
                      style={{ color: "#FFD43B" }}
                    />
                    <FontAwesomeIcon
                      icon={faStar}
                      style={{ color: "#FFD43B" }}
                    />
                    <FontAwesomeIcon
                      icon={faStar}
                      style={{ color: "#FFD43B" }}
                    />
                  </div>
                  <p className="text-xl font-semibold text-gray-600 dark:text-gray-200">
                    {review.author}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReviewsSection
