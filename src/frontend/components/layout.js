import Alert from './alert'

export default function Layout({ preview, children }) {
  return (
    <>
      <Alert preview={preview} />
      <main>{children}</main>
    </>
  )
}
