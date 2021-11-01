import React, { useCallback, useEffect, useState } from "react";
import './App.css';

function App({initialRowsColumns}) {
    const [resultArray, setNewResult] = useState(null);
    const [passengerNo, setPassengerNo] = useState(0);
    const generateWorkingArray = useCallback(() => {
        const input2DArray = initialRowsColumns || JSON.parse(localStorage.getItem('input2DArray')) || [ [3,2], [4,3], [2,3], [3,4] ];
        const resultArray = input2DArray.map((childArray, i) => {
            const tempArray = [];
            for(let j = 0; j < Number(childArray[1]); j++) {
                const arrayObj = [];
                for(let a = 0; a < Number(childArray[0]); a++) {
                    let seatType = (i === 0 && a === 0) || ((i === (input2DArray.length - 1)) && (a === (childArray[0]-1))) ? 'window'
                        : (a !== 0 && a !== (Number(childArray[0]) - 1) ? 'center' : 'aisle');
                    let available = (input2DArray.length === 1) && (j+1 === 1) && (a === 0) && (seatType === 'window');
                    available = available || ((j+1 === 1) && (i+1 === 1) && (seatType === 'aisle'));
                    arrayObj.push({id: i + '' + j + '' + a, seatType, row: j+1, parentColumn: i+1, available});
                }
                tempArray.push(arrayObj);
            }
            return tempArray;
        });
        setNewResult(resultArray);
    }, [initialRowsColumns]);

    useEffect(()=>{
        generateWorkingArray();
    }, [generateWorkingArray]);

    const computeColumn = (arr) => {
        let templateColumn = '';
        arr?.forEach(item => { templateColumn += 'auto ';});
        return templateColumn;
    }

    const findSeatExist = (arr, seat) => {
        let seatFound = null;
        let filterSeatType = []
        arr.forEach(arr1 => {
            arr1.forEach(arr2 => {
                arr2.forEach(item => {
                    if(!seatFound && seat.seatType === item.seatType && seat.id !== item.id && !item.booked) {
                        seatFound = item;
                    }
                    if(seat.seatType === item.seatType && seat.id !== item.id && !item.booked) {
                        filterSeatType.push(item);
                    }
                })
            })
        });
        let sameRowExist = filterSeatType.find(item => item?.row === seat?.row)
        return sameRowExist || seatFound;
    }

    const setExistArray = (bookedSeatExist, tempArray) => {
        const existIds = (bookedSeatExist.id).split('').map(i => Number(i));
        tempArray[existIds[0]][existIds[1]][existIds[2]] = {...bookedSeatExist, available: true};
        setNewResult(tempArray);
    }
    const openNewAvailableSeat = (arr, bookedSeat) => {
        const tempArray = JSON.parse(JSON.stringify(arr));
        const ids = (bookedSeat.id).split('').map(i => Number(i));
        const bookedChildRowArr = tempArray[ids[0]][ids[1]];
        const sameRowAvailExist = bookedChildRowArr.findIndex(item => bookedSeat.id !== item.id && item.seatType === bookedSeat.seatType && !item.booked)
        if(sameRowAvailExist > -1) {
            tempArray[ids[0]][ids[1]][sameRowAvailExist] = {...tempArray[ids[0]][ids[1]][sameRowAvailExist], available: true};
            setNewResult(tempArray);
            return;
        }
        if(!(tempArray[ids[0] + 1])){
            let parentIndex = tempArray.length === ids[0] + 1 ? 0 : ids[0];
            let childIndex = tempArray[parentIndex].length === ids[1] + 1 || tempArray[parentIndex].length < ids[1] + 1 ? 0 : (ids[1] + 1);
            let availIndex = tempArray[parentIndex][childIndex].findIndex(item => item.seatType === 'aisle' && !item.booked);
            availIndex = availIndex > -1 ? availIndex : tempArray[parentIndex][childIndex].findIndex(item => item.seatType === 'window' && !item.booked);
            availIndex = availIndex > -1 ? availIndex : tempArray[parentIndex][childIndex].findIndex(item => item.seatType === 'center' && !item.booked);
            if(!tempArray[parentIndex][childIndex][availIndex] || (tempArray[parentIndex][childIndex][availIndex]['seatType'] !== bookedSeat.seatType)){
                const bookedSeatExist = findSeatExist(tempArray, bookedSeat);
                if(bookedSeatExist) {
                    setExistArray(bookedSeatExist, tempArray);
                    return;
                }
            }
            tempArray[parentIndex][childIndex][availIndex] = {...tempArray[parentIndex][childIndex][availIndex], available: true};
            setNewResult(tempArray);
            return;
        }
        if(tempArray[ids[0] + 1]){
            let parentIndex = bookedSeat.seatType === 'window' ? (ids[0] === 0 ? tempArray.length-1 : 0) : (ids[0] + 1); 
            let childIndex = bookedSeat.seatType === 'window' ? (ids[0] === 0 ? ids[1] : (ids[1] + 1)) : ids[1]; 
            let availIndex = tempArray[parentIndex][childIndex].findIndex(item => item.seatType === 'aisle' && !item.booked);
            availIndex = availIndex > -1 ? availIndex : tempArray[parentIndex][childIndex].findIndex(item => item.seatType === 'window' && !item.booked);
            availIndex = availIndex > -1 ? availIndex : tempArray[parentIndex][childIndex].findIndex(item => item.seatType === 'center' && !item.booked);
            if(!tempArray[parentIndex][childIndex][availIndex] || (tempArray[parentIndex][childIndex][availIndex]['seatType'] !== bookedSeat.seatType)){
                const bookedSeatExist = findSeatExist(tempArray, bookedSeat);
                if(bookedSeatExist) {
                    setExistArray(bookedSeatExist, tempArray);
                    return;
                }
            }
            tempArray[parentIndex][childIndex][availIndex] = {...tempArray[parentIndex][childIndex][availIndex], available: true};
            setNewResult(tempArray);
            return;
        }
    }

    const bookTicket = (seat) => {
        if(seat.available) {
            const ids = (seat.id).split('');
            const passenger = passengerNo + 1;
            setPassengerNo(passenger);
            const updatedSeat = {...seat, passenger, available: false, booked: true};
            console.log("Booked passenger details", updatedSeat);
            const tempArray = JSON.parse(JSON.stringify(resultArray));
            tempArray[Number(ids[0])][Number(ids[1])][Number(ids[2])] = updatedSeat;
            setNewResult(tempArray);
            openNewAvailableSeat(tempArray, updatedSeat);
        }
    }

    return (
        <div className="App-header">
            <div className="parent" style={{gridTemplateColumns: computeColumn(resultArray)}}>
                {resultArray?.map((item1, i) => <div key={i}>
                    {item1.map((item2, j) => <div key={i+''+j} className={`child row${j + 1}`}>
                        {item2.map(item3 => <div key={item3.id} className={`${item3.seatType} ${item3.available ? 'available' : (item3.booked ? 'booked':'')}`} onClick={() => bookTicket(item3)}>
                            {item3.passenger || ''}
                        </div>)}
                    </div>)}
                </div>)}
            </div>

            <div className="character">
                <div><span className="available"/> Available</div>
                <div><span className="booked"/> Booked</div>
                <div><span className="yetToBook"/> Yet to Book</div>
            </div>
        </div>
    );
}
  
export default App;