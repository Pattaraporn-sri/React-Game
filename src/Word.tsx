import { useEffect, useState } from "react";
import "./App";
import "./App.css";
import words from "./words.json";
import Button from "../src/Button";
import sign from "../src/image/Headsign-Photoroom.png";
import Box8 from "../src/image/Box8.jpg";
import card from "../src/image/card.png"
import card2 from "../src/image/card2.png"
import cat from "../src/image/cat.png"

type Nametype = {
  word: string;
  lang: string;
};

function Word() {
  const [selectedword, setSelectedWord] = useState<Nametype[]>(words);
  const [Thai, setThai] = useState<Nametype[]>([]);
  const [Eng, setEng] = useState<Nametype[]>([]);
  const [lockedThai, setLockedThai] = useState<string[]>([]); // รายการคำที่ล็อคในกล่องไทย
  const [lockedEng, setLockedEng] = useState<string[]>([]); // รายการคำที่ล็อคในกล่องอังกฤษ
  const [timeouts, setTimeouts] = useState<Record<string, number>>({});
  const [_, setCountdowns] = useState<Record<string, number>>({});

  //ตั้งค่าคำศัพท์เริ่มต้นจาก json
  useEffect(() => {
    console.log(words);  // ตรวจสอบข้อมูลที่นำเข้า
    setSelectedWord(words);
  }, []);

  //แยกlang ไทย,อิ้ง
  const handlewordClick = (word: string, lang: string) => {
    if (lang === "TH") {
      setThai([...Thai, { word, lang }]);
      startCountdown(word, lang, 5);
    } else {
      setEng([...Eng, { word, lang }]);
    }
    // ลบคำออกจาก selectedword
    setSelectedWord((item) => item.filter((w) => w.word !== word));

    if (
      (lang === "TH" && !lockedThai.includes(word)) ||
      (lang === "ENG" && !lockedEng.includes(word))
    ) {
      // ตั้งเวลา 5 วินาที ให้เรียกคืนคำกลับ (ใช้สำหรับทั้งไทยและอังกฤษ)
      const timeoutID = window.setTimeout(() => {
        handlereturnClick(word, lang);
      }, 5000); // 5000 มิลลิวินาที = 5 วินาที

      setTimeouts((prev) => ({ ...prev, [word]: timeoutID }));
    }
  };

  const startCountdown = (word: string, lang: string, duration: number) => {
    if (
      (lang === "TH" && lockedThai.includes(word)) ||
      (lang === "ENG" && lockedEng.includes(word))
    ) {
      return; // If word is locked, do not start countdown
    }

    let remainingTime = duration;
    setCountdowns((prev) => ({ ...prev, [word]: remainingTime }));

    const intervalID = window.setInterval(() => {
      remainingTime -= 1;
      setCountdowns((prev) => ({ ...prev, [word]: remainingTime }));

      if (remainingTime <= 0) {
        clearInterval(intervalID);
        handlereturnClick(word, lang);
        setCountdowns((prev) => {
          const { [word]: _, ...rest } = prev;
          return rest;
        });
      }
    }, 1000);

    setTimeouts((prev) => ({ ...prev, [word]: intervalID }));
  };

  //ส่งค่าคืนกลับไปทีละตัว
  const handlereturnClick = (word: string, lang: string) => {
    if (lang === "TH" && !lockedThai.includes(word)) {
      // ลบคำออกจากกล่องภาษาไทย
      setThai((item) => item.filter((w) => w.word !== word));
    } else if (lang === "ENG" && !lockedEng.includes(word)) {
      // ลบคำออกจากกล่องภาษาอังกฤษ
      setEng((item) => item.filter((w) => w.word !== word));
    }

    //เพิ่มคำกลับไปที่ selectedword ทีละตัว
    setSelectedWord((prevSelected) => {
      //เช็คว่า word เคยอยู่ใน setectedword แล้วหรือยัง
      if (!prevSelected.some((w) => w.word === word)) {
        return [...prevSelected, { word, lang }];
      }
      return prevSelected; //ถ้าเคยอยู่แล้วจะไม่เพิ่ม
    });
  };

  // // ใช้ useEffect สำหรับการตั้งเวลา
  // useEffect(() => {
  //   // ตั้งเวลาคืนค่า 5 วินาที ถ้าคำไม่ถูกล็อค
  //   Thai.forEach((word) => {
  //     if (!lockedThai.includes(word.word)) {
  //       setTimeout(() => {
  //         handlereturnClick(word.word, "TH");
  //       }, 5000);
  //     }
  //   });

  //   Eng.forEach((word) => {
  //     if (!lockedEng.includes(word.word)) {
  //       setTimeout(() => {
  //         handlereturnClick(word.word, "ENG");
  //       }, 5000);
  //     }
  //   });
  // }, [Thai, Eng, lockedThai, lockedEng]);

  // ฟังก์ชันล็อคคำ
  const handleLockClick = (word: string, lang: string) => {
    if (lang === "TH" && !lockedThai.includes(word)) {
      setLockedThai((prev) => {
        if (!prev.includes(word)){
          return [...prev, word];
        }
        return prev;
      });
    } else if (lang === "ENG" && !lockedEng.includes(word)) {
      setLockedEng((prev) => {
        if (!prev.includes(word)){
          return [...prev, word];
        }
        return prev;
      });
    }
    //ยกเลิก timeout ถ้ามี
    if (timeouts[word]) {
      clearTimeout(timeouts[word]);
      setTimeouts((prev) => {
        const { [word]: _, ...rest } = prev;
        return rest;
      });
      setCountdowns((prev) => {
        const { [word]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  return (
    <>
      <div className="absolute bg-bgred h-screen w-full">
        <img src={card} className="absolute h-56 bottom-0 ml-[1320px] mb-10"/>
        <img src={card2} className="absolute h-64 bottom-0 mb-10 ml-20"/>
        <img src={cat} className="absolute h-36 ml-[720px] mt-[510px]"/>
        <div className="flex items-center ml-10">
          <div className="relative">
            <img className="h-44 w-64 ml-44" src={sign} />
            <p className="absolute font-bold text-center ml-[240px] -mt-[100px] font font-Goblin">
              Volcabulary
            </p>
          </div>
          <div className="relative ml-44">
            <img className="h-44 w-64" src={sign} />
            <div className="absolute font-bold text-center font font-Goblin ml-[75px] -mt-[100px]">
              Thai Word
            </div>
          </div>

          <div className="relative ml-44">
            <img className="h-44 w-64" src={sign} />
            <div className="absolute font font-Goblin font-bold ml-[80px] -mt-[100px]">
              Eng Word
            </div>
          </div>
        </div>
        <div>
          <div className="flex">
            <img
              className="h-[500px] -mt-[20px] ml-44 rounded-lg shadow-xl shadow-neutral-800"
              src={Box8}
            />
            <div className="absolute ml-56 mt-1 text-center font font-Kanit">
              {selectedword.map((word) => (
                <div
                  key={`${word.word}-${word.lang}`}
                  className="bg-[#dbbc8c] hover:bg-[#b49c74] h-9 w-60 mt-2 flex flex-col justify-center items-center rounded-xl shadow-md shadow-zinc-800 border-2 border-orange-100"
                >
                  <Button
                    key={`${word.word}-${word.lang}`}
                    word={word.word}
                    lang={word.lang}
                    handleClick={handlewordClick}
                  />
                </div>
              ))}
            </div>

            <div className="flex">
              <img
                className="h-[500px] -mt-[20px] ml-20 rounded-xl shadow-xl shadow-neutral-800"
                src={Box8}
              />
              <div className="absolute flex flex-col-reverse">
                {Thai.map((word) => (
                  <div className="ml-32 mt-2" key={`${word.word}-${word.lang}`}>
                    <div className="bg-[#dbbc8c] hover:bg-[#b49c74] h-9 w-60 mt-2 border-2 rounded-lg flex flex-row items-center justify-between px-2 py-1">
                      <Button
                        word={word.word}
                        lang={word.lang}
                        handleClick={handlereturnClick}
                        handleLock={() => handleLockClick(word.word, word.lang)}
                        canLock = {true}
                      />
                      {/* <span>
                        {countdowns[word.word]
                          ? `${countdowns[word.word]}s`
                          : ""}
                      </span> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex">
              <img
                className="h-[500px] -mt-[20px] ml-20 rounded-xl shadow-xl shadow-neutral-800"
                src={Box8}
              />
              <div className="absolute">
                {Eng.map((word) => (
                  <div className="ml-56 mt-2" key={`${word.word}-${word.lang}`}>
                    <Button
                      word={word.word}
                      lang={word.lang}
                      handleClick={handlereturnClick}
                      handleLock={() => handleLockClick(word.word, word.lang)}
                      canLock
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Word