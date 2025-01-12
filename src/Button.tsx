import { useEffect, useState } from "react";
import { FaLock, FaLockOpen } from "react-icons/fa";

type wordType = {
  word: string;
  lang: string;
  handleClick: (word: string, lang: string) => void;
  handlereturn?: (word: string, lang: string) => void; //ย้ายข้อความกลับไปกล่องแรก //void จะไม่ส่งค่ากลับ //? คือ propนี้ไม่จำเป้นต้องส่งมา
  canLock?: boolean;
  handleLock ? : () => void;
};

function Button({ word, lang, handleClick, handlereturn, canLock }: wordType) {
  const [Lock, setLock] = useState(false);
  const [countdown, setCountdown] = useState(5);

  //จับเวลา
  useEffect(() => {
    if (Lock || !handlereturn) return; //ถ้า Lock เป็น ture ให้หยุดการนับถอยหลัง //ถ้าไม่มี handlereturn หรือถูกล็อคให้หยุดจับเวลา

    setCountdown(5); //รีเซ็ตตัวจับเวลา ปลดล็อคแล้วจะเริ่มนับ 5 ใหม่
    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 0) {
          handlereturn(word, lang); //เรียกใช้ฟังก์ชัน handlereturn เมื่อเวลานับถึง 0 ให้ส่งค่ากลับ'
          clearInterval(countdownInterval);
          return 5; // รีเซ็ตตัวจับเวลา
        }
        return prevCountdown - 1; //ลดค่าทีละ 1
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [Lock, word, lang, handlereturn]); //ใช้ Lock เพื่อรัน effect ใหม่เมื่อ Lock เปลี่ยน //ใช้ Lock  กับ handlereturn เป็น dependency

  const handleLockClick = () => {
    setLock(!Lock); // Toggle Lock state
  };

  return (
    <div>
      {handlereturn ? ( //ถ้า handlereturn มีค่า แสดงตัวจับเวลา
        Lock ? (
          <button className="word">
            {word}
            {countdown}
          </button>
        ) : (
          <button
            className="word"
            onClick={() => {
              handleClick(word, lang); //เมื่อคลิกแล้วจะย้ายค่าไป
            }}
          >
            {word}
            {countdown}
          </button>
        )
      ) : (
        <button className="word" onClick={() => handleClick(word, lang)}>
          {word} {/*ไม่แสดงตัวจับเวลาในกรณีที่คำอยู่ใน selectedword */}
        </button>
      )}

      <div
        className="icon-lock"
        onClick={() => {
          setLock(!Lock); //สลับสถานะ Lock
        }}
      >
        {canLock ? Lock ? <FaLock /> : <FaLockOpen /> : null}
      </div>
    </div>
  );
}

export default Button;
