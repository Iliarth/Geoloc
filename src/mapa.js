import React from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';

const mapStyles = {
  width: '100%',
  height: '100%',
  position: 'absolute'
};

export class MapContainer extends React.Component {

  state = {
    modalShow: false,
    pais: "",
    codPais: "",
    lat: 0,
    lng: 0,
    temperatura: "",
    capital: "",
    summary: "",
  }

  handleShow = ()=>{
    this.setState({
      modalShow: true
    })
  }
  
  handleHide = () =>{
    this.setState({
      modalShow: false
    })
  }

  clickMap = (t, map, coord) => {
    const { latLng } = coord;
    this.getpais(latLng.lat(), latLng.lng());
  }

  getTemperatura = (lat, lgt) => {
    fetch('http://localhost:8000/gettemperatura?key=a1536ef7be5973587d4c54cf3dc2ef5f&lat=' + lat + '&lgt=' + lgt)
        .then(res => res.json())
        .then((data) => {
          this.setState({ temperatura: Math.round(data.temperatura) + '°C'})
          this.handleShow();
        })
        .catch(error => {
          console.log("Error");
          this.getTemperatura(this.state.lat, this.state.lng);
        });
  }

  getcapital = (codPais) => {
    fetch('http://localhost:8000/getcapital?pais=' + codPais)
        .then(res => res.json())
        .then((data) => {
          this.setState({ capital: data[0].capitalCity, 
                          lat: data[0].latitude, 
                          lng: data[0].longitude 
                        })
          this.getTemperatura(this.state.lat, this.state.lng);
        })
        .catch(console.log)
        
  
  }

  getpais = (lat, lgt) => {
    fetch('http://localhost:8000/getpais?lat='+lat+'&lgt='+lgt)
        .then(res => res.json())
        .then((data) => {
          this.setState({ pais: data.long_name, 
                          codPais: data.short_name 
                        })
          this.getcapital(this.state.codPais);
        })
        .catch(console.log)
  }

  render() {
    return (
      <div>
        <Map style={mapStyles}
          initialCenter={{ lat: -33.4577664, lng: -70.6576384 }}
          google={this.props.google}
          zoom={3}
          minZoom={3}
          disableDoubleClickZoom={true}
          //gestureHandling={'none'} 
          fullscreenControl={false}
          mapTypeControl={false}
          zoomControl={false}
          streetViewControl={false}
          onClick={this.clickMap}
        >
        </Map>
        {this.state.modalShow && 
        <Modal.Dialog >
          <Modal.Header>
            <Modal.Title>Temperatura</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>La temperatura en {this.state.capital}/{this.state.pais} es de {this.state.temperatura} </p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleHide}>Cerrar</Button>
          </Modal.Footer>
        </Modal.Dialog>}
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyA3BZlyFda4GGro9wg_eNTJkN6u8D_7JXM', language: 'es'
})(MapContainer)
