import React from 'react'

import Particles from 'react-particles-js';

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


const initialState = {
      input: '',
      imageUrl:'',
      box:{},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      },
    }

class App extends React.Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({ user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
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
    fetch('http://localhost:8080/imageurl', {
            method: 'put',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
              input: this.state.input     
            }) 
          })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('http://localhost:8080/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id     
            }) 
          })
            .then(response => response.json())
            .then(entries => this.setState(Object.assign(this.state.user, { entries: entries })))
            .catch(err => console.log(err))
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err))
  }

  onRouteChange = (route) => {

    if (route === 'signout') {
      this.setState(initialState)
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
                  <Rank user={this.state.user.name} entries={this.state.user.entries} />
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
                  ? <SignIn onRouteChange = {this.onRouteChange} loadUser={this.loadUser}/>

                  : <Register onRouteChange= {this.onRouteChange} loadUser={this.loadUser}/>
                )      
          }
        </div>
    );
  }
}

export default App;
