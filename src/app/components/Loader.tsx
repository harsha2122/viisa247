import React, { Component, CSSProperties } from 'react';
import { toAbsoluteUrl } from '../../_metronic/helpers';

interface LoaderProps {
  loading: boolean;
}

class Loader extends Component<LoaderProps> {
  render() {
    const overlayStyle: CSSProperties = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      opacity: 0,
      visibility: 'hidden',
      transition: 'opacity 0.3s, visibility 0.3s',
    };

    const spinnerStyle: CSSProperties = {
      border: '4px solid rgba(255, 255, 255, 0.3)',
      borderTop: '4px solid #3498db',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      animation: 'spin 1s linear infinite',
    };

    const activeOverlayStyle: CSSProperties = {
      opacity: 1,
      visibility: 'visible',
    };

    const pleaseWaitStyle: CSSProperties = {
      textAlign:'center',
    };

    return (
      <div style={{ ...overlayStyle, ...(this.props.loading && activeOverlayStyle) }}>
        <div style={pleaseWaitStyle}>
          <div style={{alignSelf:'center'}} ></div>
          <img style={{width:"150px", height:"150px", borderRadius:"20px"}}
            src={toAbsoluteUrl('/media/loadere.gif')} />
          <br />
        </div>
      </div>
    );
  }
}

export default Loader;
