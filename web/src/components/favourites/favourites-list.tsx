import { fetchFavourites } from '@books-about-food/core/services/favourites/fetch-favourites'
import { updateFavourite } from '@books-about-food/core/services/favourites/update-favourite'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { X } from 'src/components/atoms/icons'
import { call } from 'src/utils/service'
import z from 'zod'
import { Avatar } from '../atoms/avatar'
import { GridContainer } from '../lists/grid-container'
import { Toaster } from '../utils/toaster'

export const FavouritesList = async () => {
  const { data: favourites } = await call(fetchFavourites, undefined)
  const toaster = (
    <Toaster
      action="unfavourite"
      type="success"
      message="Profile removed from your favourites"
    />
  )

  if (!favourites?.length)
    return (
      <p>
        {toaster}
        You have no favourites!{' '}
        <Link href="/people" className="underline">
          Find some
        </Link>
      </p>
    )

  async function unfavourite(data: FormData) {
    'use server'

    const { profileId } = z
      .object({
        profileId: z.string()
      })
      .parse(Object.fromEntries(data.entries()))
    await call(updateFavourite, { profileId, isFavourite: false })
    redirect('/account/favourites?action=unfavourite')
  }

  return (
    <GridContainer className="sm:!auto-grid-xl">
      {toaster}
      {favourites.map((profile) => (
        <li key={profile.id}>
          <form action={unfavourite} className="relative flex items-center">
            <Link
              href={profile.href}
              className="px-5 py-4 border border-black flex gap-4 -mb-px sm:-mr-px items-center flex-grow"
            >
              <Avatar profile={profile} />
              <div className="flex flex-col overflow-hidden">
                <p className="font-medium whitespace-nowrap text-ellipsis overflow-hidden">
                  {profile.name}
                </p>
                {!!profile.jobTitle && (
                  <p className="text-12 whitespace-nowrap text-ellipsis overflow-hidden">
                    {profile.jobTitle}
                  </p>
                )}
              </div>
            </Link>
            <input type="hidden" name="profileId" value={profile.id} />
            <button className="absolute right-1 p-4">
              <X strokeWidth={1} />
            </button>
          </form>
        </li>
      ))}
    </GridContainer>
  )
}
