import styled from 'styled-components';


function Modal({isOpen, onClose, closeText, children}) {
  // Only return content if actually open
  if (!isOpen) return null;

  return (
    <Overlay>
      <Content>
        {children}
        <CloseButton onClick={onClose}>{closeText}</CloseButton>
      </Content>
    </Overlay>
  );
}

// const Overlay = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
  
//   background-color: rgba(0, 0, 0, 0.5);

//   position: fixed;
//   top: 0;
//   left: 0;
  
//   width: 100%;
//   height: 100%;
// `;

// const Content = styled.div`
//   position: relative;
//   background-color: white;
//   padding: 32px;
//   border-radius: 8px;
// `;

// const CloseButton = styled.button`
//   width: 100%;
//   margin-top: 4px;
// `;

export default Modal;
