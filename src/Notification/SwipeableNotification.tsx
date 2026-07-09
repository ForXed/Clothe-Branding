import { ReactNode } from "react";
import {
  animate,
  motion,
  PanInfo,
  useMotionValue,
  useTransform,
} from "framer-motion";
import styles from "./SwipeableNotification.module.css";

interface Props {
  children: ReactNode;
  onDelete?: () => void;
  onMarkAsRead?: () => void;
}

const THRESHOLD = 120;

export default function SwipeableNotification({
  children,
  onDelete,
  onMarkAsRead,
}: Props) {
  const x = useMotionValue(0);
  const DRAG_LIMIT = 140;
  const THRESHOLD = 100;

  // Fade actions in as you drag
  const leftOpacity = useTransform(x, [0, THRESHOLD], [0, 1]);
  const rightOpacity = useTransform(x, [-THRESHOLD, 0], [1, 0]);

  const handleDragEnd = (_: PointerEvent, info: PanInfo) => {
    if (info.offset.x > THRESHOLD) {
      onMarkAsRead?.();

      animate(x, 0, {
        type: "spring",
        stiffness: 400,
        damping: 30,
      });

      return;
    }

    if (info.offset.x < -THRESHOLD) {
      animate(x, -window.innerWidth, {
        duration: 0.25,
        onComplete: onDelete,
      });
      return;
    }

    animate(x, 0, {
      type: "spring",
      stiffness: 400,
      damping: 30,
    });
  };

  return (
    <div className={styles.wrapper}>
      <motion.div
        className={`${styles.action} ${styles.read}`}
        style={{ opacity: leftOpacity }}
      >
        ✓ Read
      </motion.div>

      <motion.div
        className={`${styles.action} ${styles.delete}`}
        style={{ opacity: rightOpacity }}
      >
        🗑 Delete
      </motion.div>

      <motion.div
        className={styles.card}
        drag="x"
        dragConstraints={{ left: -DRAG_LIMIT, right: DRAG_LIMIT }}
        dragDirectionLock
        dragElastic={0.15}
        dragMomentum={false}
        style={{ x }}
        onDragEnd={handleDragEnd}
      >
        {children}
      </motion.div>
    </div>
  );
}
