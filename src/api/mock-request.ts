export const mockRequest = async <T>(payload: T, delay = 350): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(payload), delay)
  })

