"use client"

import Image from "next/image"

export function HeroSection() {
  return (
    <header className="relative w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-stadium.jpg"
          alt="Super Bowl Stadium"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 pt-10 pb-8 sm:pt-16 sm:pb-12">
        {/* Matchup logos */}
        <div className="flex items-center gap-3 sm:gap-6 mb-4 sm:mb-6">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-seahawks-green/60 shadow-lg shadow-seahawks-green/20">
              <Image
                src="/images/seahawks-logo.jpg"
                alt="Seattle Seahawks"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="font-display text-xs sm:text-sm uppercase tracking-wider text-seahawks-green font-bold mt-2">
              Seahawks
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="font-display text-3xl sm:text-5xl font-black text-foreground tracking-tight">
              VS
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-patriots-red/60 shadow-lg shadow-patriots-red/20">
              <Image
                src="/images/patriots-logo.jpg"
                alt="New England Patriots"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="font-display text-xs sm:text-sm uppercase tracking-wider text-patriots-red font-bold mt-2">
              Patriots
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-foreground text-center uppercase tracking-tight text-balance leading-none">
          Super Bowl
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-seahawks-green to-patriots-red">
            Squares
          </span>
        </h1>

        <p className="text-muted-foreground text-sm sm:text-base mt-3 text-center max-w-md text-pretty">
          Pick your squares, submit your claim, and send payment to confirm.
          Numbers are randomly assigned before kickoff!
        </p>
      </div>
    </header>
  )
}
