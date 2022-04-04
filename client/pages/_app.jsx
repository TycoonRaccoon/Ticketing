import buildClient from '../api/build-client'
import Header from '../components/header'
import 'bootstrap/dist/css/bootstrap.css'

const AppComponent = ({ Component, ...page_props }) => (
	<>
		<Header {...page_props} />
		<div className='container'>
			<Component {...page_props} />
		</div>
	</>
)

AppComponent.getInitialProps = async ({ Component, ctx }) => {
	const client = buildClient(ctx)
	const { data } = await client.get('/api/users/current-user')

	const page_props = Component.getInitialProps && (await Component.getInitialProps(ctx, client, data.current_user))

	return { ...page_props, ...data }
}

export default AppComponent
