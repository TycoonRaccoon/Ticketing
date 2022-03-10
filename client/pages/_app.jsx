import buildClient from '../api/build-client'
import Header from '../components/header'
import 'bootstrap/dist/css/bootstrap.css'

const AppComponent = ({ Component, ...page_props }) => (
	<>
		<Header {...page_props} />
		<Component {...page_props} />
	</>
)

AppComponent.getInitialProps = async ({ Component, ctx }) => {
	const { data } = await buildClient(ctx).get('/api/users/current-user')

	const page_props = Component.getInitialProps && (await Component.getInitialProps(ctx))

	return { ...page_props, ...data }
}

export default AppComponent
