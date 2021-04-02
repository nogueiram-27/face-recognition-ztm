import React from 'react'

import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

import Navigation from './components/navigation/navigation';
import Logo from './components/logo/logo';
import ImagemLinkForm from './components/imagem-link-form/imagem-link-form';
import Rank from './components/rank/rank';
import FaceRecognition from './components/face-recognition/face-recognition';
import SignIn from './components/sign-in/sign-in'
import Register from './components/register/register'

import './App.css';


const particlesOptions = {
  particles: {
    number: {
      value: 60,
      density: {
        enable:true,
        value_area: 800,
      }
    }
  }
}

const app = new Clarifai.App({
 apiKey: '1a666ff735764bb1b3d4e8c1b5765cc5'
});

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl:'',
      box:{},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (width * clarifaiFace.right_col),
      bottomRow: height - (height * clarifaiFace.bottom_row)
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box })
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })

  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input })

    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err))
  }

  onRouteChange = (route) => {

    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route==='home') {
      this.setState({isSignedIn: true})
    }

    this.setState({route: route})
  }

  render() {
      return (
        <div className="App">
          <Particles 
            className='particles'
            params={particlesOptions} 
          />
        <Navigation isSignedIn = {this.state.isSignedIn} onRouteChange= {this.onRouteChange}/>
          { this.state.route === 'home' 
              ? <div>
                  <Logo />
                  <Rank />
                  <ImagemLinkForm 
                    onInputChange={this.onInputChange}
                    onButtonSubmit={this.onButtonSubmit}
                  />
                  <FaceRecognition 
                    imageUrl={this.state.imageUrl}
                    box={this.state.box}
                  />
                </div>

              : ( this.state.route ==='signin'
                  ? <SignIn onRouteChange = {this.onRouteChange}/>

                  : <Register onRouteChange= {this.onRouteChange}/>
                )      
          }
        </div>
    );
  }
}

export default App;
