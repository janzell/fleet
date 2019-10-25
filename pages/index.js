import routes from '../routes';

const {Router} = routes;

const Home = () => {
  return null;
};

Home.getInitialProps = ({res}) => {
  if (res) {
    res.writeHead(302, {
      Location: '/login'
    });
    res.end()
  } else {
    Router.push('/login')
  }
};

export default Home;
