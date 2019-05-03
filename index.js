'use strict'
let { useState, useEffect } = require('react')
let _throttle = require('lodash.throttle')
let w = typeof window !== 'undefined'

let supportsPassive = false
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function() {
      supportsPassive = true
    },
  })
  w && window.addEventListener('testPassive', null, opts)
  w && window.removeEventListener('testPassive', null, opts)
} catch (e) {}

let getPosition = () => ({
  x: w && window.pageXOffset,
  y: w && window.pageYOffset,
})

let defaultOptions = {
  throttle: 100,
}

function useWindowScrollPosition(options) {
  let opts = Object.assign({}, defaultOptions, options)

  let [position, setPosition] = useState(getPosition())

  useEffect(() => {
    let handleScroll = _throttle(() => {
      setPosition(getPosition())
    }, opts.throttle)

    w && window.addEventListener(
      'scroll',
      handleScroll,
      supportsPassive ? { passive: true } : false
    )

    return () => {
      w && window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return position
}

module.exports = useWindowScrollPosition
