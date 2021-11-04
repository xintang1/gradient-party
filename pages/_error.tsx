import { Result } from 'antd'

const errorMessage = (statusCode) => {
  switch (statusCode) {
    case 403:
      return "Sorry, you are not authorized to access this page."
      break;
    case 404:
      return "Sorry, the page you visited does not exist."
      break;
    case 500:
      return "Sorry, something went wrong."
      break;
    default:
      return "Sorry, something went wrong."
      break;
  }
}

function Error({ statusCode, type, message } : any) {
  return (
    <Result
      status={type? type: statusCode}
      title={statusCode}
      subTitle={message? message : errorMessage(statusCode)}
    />
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error