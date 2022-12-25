import {useRef, useEffect} from 'react'
import {apiUrl} from './api'

/**
 * Returns the width and height for the specified image.
 */
export const getImageDimensions = (src: string) => {
    return new Promise<{width: number; height: number}>((resolve, reject) => {
        const image = new Image()
        image.onload = () => {
            resolve({width: image.width, height: image.height})
        }
        image.onerror = (error) => {
            reject(error)
        }
        image.src = src
    })
}


/**
 * Capitalises the first character in a string.
 */
export const capitalizeFirst = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * A function that returns a random image URL and that image's
 * seed, which can be used to refer back to that image in API requests.
 */
export const getRandomImageUrl = () => {
    const seed = Date.now()
    return {src: apiUrl('random-image', {seed}), seed}
}


const baseUrl = process.env.REACT_APP_BASE_URL || ""

export function getLink(path: string): string{
    return baseUrl + path

}