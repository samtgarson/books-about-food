import SuggestEdit from '../templates/suggest-edit'

const url = 'https://google.com'
const resourceName = 'Resource Name'
const suggestion =
  "I think you're missing Harry Styles from the team, he designed the front cover."
const userEmail = 'imnotharry@styles.com'

export function book() {
  return (
    <SuggestEdit
      resourceName={resourceName}
      resourceType="book"
      suggestion={suggestion}
      url={url}
      userEmail={userEmail}
    />
  )
}

export function profile() {
  return (
    <SuggestEdit
      resourceName={resourceName}
      resourceType="profile"
      suggestion={suggestion}
      url={url}
      userEmail={userEmail}
    />
  )
}
