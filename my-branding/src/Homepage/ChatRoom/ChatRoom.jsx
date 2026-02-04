import React from 'react';
import styles from './ChatRoom.module.css';

const ChatRoom = () => (
  <div className={styles.chatWrapper}>
    <div className={styles.contactInfo}>
      <div className={styles.makerAvatar}>B</div>
      <div>
        <h3>Brutige Maker Studio</h3>
        <p>Online • Direct Infrastructure Support</p>
      </div>
    </div>

    <div className={styles.messageHistory}>
      <div className={styles.received}>Hello! Please send your logo file (SVG/PNG) to begin your brand sampling.</div>
      <div className={styles.sent}>I just placed an order for 50 Heavyweight Hoodies. Can we do puff print on these?</div>
      <div className={styles.received}>Absolutely. Upload the graphic here and we'll send a digital mockup.</div>
    </div>

    <div className={styles.inputArea}>
      <button className={styles.plus}>+</button>
      <input type="text" placeholder="Message Brutige..." />
      <button className={styles.send}>Send</button>
    </div>
  </div>
);

export default ChatRoom;