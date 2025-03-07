import { useEffect, useRef, useState } from "react";
import "./App.css";
import './assets/images/icon-arrow.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // (Optional for components like modals, tooltips)
import InstallPWA from "./InstallPWA.js";


export default function App() {
    return <AgeCalculator />;
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

const monthsDays = {
    1: 31,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
};

function AgeCalculator() {
    const [days, setDays] = useState("");
    const [months, setMonths] = useState("");
    const [years, setYears] = useState("");

    const [resultDays, setResultDays] = useState("--");
    const [resultmonths, setResultMonths] = useState("--");
    const [resultyears, setResultYears] = useState("--");

    const [invalidDays, setInvalidDays] = useState("");
    const [invalidMonths, setInvalidMonths] = useState("");
    const [invalidYears, setInvalidYears] = useState("");

    const dayField = useRef(null);

    useEffect(() => {
        window.addEventListener("load", () => dayField.current.focus());
    }, []);

    function handleSubmit(e) {
        let flagInvalid = false;
        e.preventDefault();

        if (!days) {
            setInvalidDays("This field is required",
                document.getElementById('dayID').style.borderColor = 'red'
            );
            flagInvalid = true;
        } else if (days > monthsDays[String(months)] || days > 31) {
            setInvalidDays("Must be a valid day",
                document.getElementById('dayID').style.borderColor = 'red'
            );
            flagInvalid = true;
        } else {
            setInvalidDays("", 
                document.getElementById('dayID').style.borderColor = ''
            );
        }

        if (!months) {
            setInvalidMonths("This field is required",
                document.getElementById('monthID').style.borderColor = 'red'
            );
            flagInvalid = true;
        } else if (months > 12) {
            setInvalidMonths("Must be a valid month",
                document.getElementById('monthID').style.borderColor = 'red'
            );
            flagInvalid = true;
        } else if (months === 2) {
            if ((isLeapYear(years) && days > 29) || (!isLeapYear(years) && days > 28)) {
                setInvalidDays("Must be a valid day",
                    document.getElementById('dayID').style.borderColor = 'red'
                );
                flagInvalid = true;
            }
        } else {
            setInvalidMonths("",
                document.getElementById('monthID').style.borderColor = ''
            );
        }

        const currentDate = new Date();

        if (!years) {
            setInvalidYears("This field is required",
                
                document.getElementById('yearID').style.borderColor = 'red'
            );
            flagInvalid = true;
        } else if (years > currentDate.getFullYear()) {
            setInvalidYears("Must be in past",
                document.getElementById('yearID').style.borderColor = 'red'
            );
            flagInvalid = true;
        } else {
            setInvalidYears("",
                document.getElementById('yearID').style.borderColor = ''
            );
        }

        const birthDate = new Date(`${years}-${months}-${days}`);

        if (birthDate > currentDate) {
            setInvalidDays("Must be in past",);
            setInvalidMonths("Must be in past");
            setInvalidYears("Must be in past");
            flagInvalid = true;
        }

        if (flagInvalid === true) return;

        let resultYears = currentDate.getFullYear() - birthDate.getFullYear();
        let resultMonths = currentDate.getMonth() - birthDate.getMonth();
        let resultDays = currentDate.getDate() - birthDate.getDate();

        if (resultDays < 0) {
            resultMonths--;
            const lastMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
            resultDays += lastMonthDays;
        }

        if (resultMonths < 0) {
            resultYears--;
            resultMonths += 12;
        }

        setInvalidDays(false);
        setInvalidMonths(false);
        setInvalidYears(false);

        setResultYears(resultYears);
        setResultMonths(resultMonths);
        setResultDays(resultDays);
    }

    function handleDays(e) {
        if (e.nativeEvent.data === ".") return;
        let value = e.target.value;
        setDays(() => (isNaN(value) ? days : Number(value)));
    }

    function handleMonths(e) {
        if (e.nativeEvent.data === ".") return;

        let value = e.target.value;
        setMonths(() => (isNaN(value) ? months : Number(value)));
    }

    function handleYears(e) {
        if (e.nativeEvent.data === ".") return;

        let value = e.target.value;
        setYears(() => (isNaN(value) ? years : Number(value)));
    }

    return (
        <>
            <form className="bg-white main-container" onSubmit={handleSubmit}>
                <div className="first-container">
                <div className="d-flex flex-row gap-4">
                    <div> 
                    <InputContainer field="Day" validityState={invalidDays}><br/>
                        <input ref={dayField} type="text" value={days} onChange={handleDays} placeholder="DD" 
                        className= "first-inputs ps-3 pb-2 py-1 rounded-3" id="dayID"/>
                    </InputContainer>
                    </div>

                   <div> 
                    <InputContainer field="Month" validityState={invalidMonths}><br/>
                        <input type="text" value={months} onChange={handleMonths} placeholder="MM" 
                        className="first-inputs ps-3 pb-2 py-1 rounded-3" id="monthID"/>
                    </InputContainer></div>

                    <div>
                    <InputContainer field="Year" validityState={invalidYears}><br/>
                        <input type="text" value={years} onChange={handleYears} placeholder="YYYY" 
                        className="first-inputs ps-3 pb-2 py-1 rounded-3" id="yearID"/>
                    </InputContainer>
                    </div></div>

                    <div className="d-flex flex-row">
                        <div className="first-line"></div>
                        <Button />
                        <div className="second-line"></div>
                    </div>
                    </div> 

                <div className="result">
                    <Result field="years" result={resultyears} />
                    <Result field="months" result={resultmonths} />
                    <Result field="days" result={resultDays} />
                </div>
            </form>
            <Attribution />
        </>
    );
}

function Result({ field, result }) {
    return (
        <p>
            <span className="result-digits">{result === "" ? "--" : result}</span> {field}
        </p>
    );
}

function InputContainer({ field, validityState, children }) {
    return (
        <div className={validityState ? "invalid" : ""}>
            <label className={validityState ? "label-invalid": "label-class"}>{field}</label>
             {children} 
            {validityState ? <small className="required-field"><br/>{validityState}</small> : ""}
        </div>
    );
}

function Button() {
    return (
            <button className="result-btn border-0 pt-2">
                
                    <div className="fisrt-arc"></div>
                    <div className="middle-line"></div>
                    <div className="second-arc"></div>
                
            </button>
    );
}

function Attribution() {
    return (
        <div className="attribution mt-5">
            Challenge by <a href="https://www.frontendmentor.io?ref=challenge">Frontend Mentor</a>. Coded by{" "}
            <a href="https://www.linkedin.com/in/ekpe-offiong/?lipi=urn%3Ali%3Apage%3Ad_flagship3_feed%3Bdyc2aWvyREm4YNx5yR83vA%3D%3D">Ekpe Offiong Jr</a>.
            <div className="button-div mt-2"><InstallPWA /></div>
        </div>
    );
}
