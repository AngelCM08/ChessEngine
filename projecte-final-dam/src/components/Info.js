import React, { useRef, useState, useEffect } from 'react';
import Modal from './Modal';

export const Info = ({ history, numMovements, onSelectTab, onChangeBoardOrientation, onChangeUpdateFreq, configState, onChangeDepth, onChangeReduceIterations, onChangeShowAscii, onChangeDebugMode }) => {
    const [selectedOption, setSelectedOption] = useState('tab1');
    const sans = history.map(move => move.san);
    const joinedHistory = sans.join(', ');

    //Modals
    const modalRefUpdateFreq = useRef(null);
    const modalRefDepth = useRef(null);
    const modalRefCapModule = useRef(null);
    const modalRefDebugMode = useRef(null);

    const openModalUpdateFreq = () => {
        if (modalRefUpdateFreq.current) {
            modalRefUpdateFreq.current.openModal();
        }
    };

    const openModalDepth = () => {
        if (modalRefDepth.current) {
            modalRefDepth.current.openModal();
        }
    };

    const openModalCapModule = () => {
        if (modalRefCapModule.current) {
            modalRefCapModule.current.openModal();
        }
    };

    const openModalDebugMode = () => {
        if (modalRefDebugMode.current) {
            modalRefDebugMode.current.openModal();
        }
    };

    //Config tabs
    const handleSelection = (selectedOption) => {
        onSelectTab(selectedOption);
        setSelectedOption(selectedOption);
    };

    //Configuration selections
    const handleBoardOrientation = (selectedOption) => {
        onChangeBoardOrientation(selectedOption);
    };

    const handleUpdateFreq = (selectedOption) => {
        onChangeUpdateFreq(selectedOption);
    };

    const handleDepth = (selectedOption) => {
        onChangeDepth(selectedOption);
    };

    const handleReduceIterations = (selectedOption) => {
        onChangeReduceIterations(selectedOption);
    };

    const handleShowAscii = (selectedOption) => {
        onChangeShowAscii(selectedOption);
    };

    const handleDebugMode = (selectedOption) => {
        onChangeDebugMode(selectedOption);
    };
    return (
        <div className="container">
            <div className="lbl-menu">
                <label className={selectedOption === 'tab1' ? 'active' : ''} htmlFor="radio1">Configuration</label>
                <label className={selectedOption === 'tab2' ? 'active' : ''} htmlFor="radio2">Advanced Configuration</label>
                <label className={selectedOption === 'tab3' ? 'active' : ''} htmlFor="radio3">Match History</label>
                <label className={selectedOption === 'tab4' ? 'active' : ''} htmlFor="radio4">XXXXXX</label>
            </div>

            <div className="content">
                <input
                    type="radio"
                    name="radio"
                    id="radio1"
                    defaultChecked
                    onChange={() => handleSelection('tab1')}
                />
                <div className="tab1">
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <div className='select'>
                                        <label>Board Orientation</label>
                                        <select value={configState.boardOrientation} onChange={handleBoardOrientation}>
                                            <option value="white">White</option>
                                            <option value="black">Black</option>
                                        </select>
                                    </div>
                                </td>
                                <td className='separator'></td>
                                <td>
                                    <div className='select'>
                                        <label><i className="fa fa-question-circle" onClick={openModalUpdateFreq}></i> Update Frequency</label>
                                        <select value={configState.updateFreq} onChange={handleUpdateFreq}>
                                            <option value="50">20 per sec</option>
                                            <option value="100">10 per sec</option>
                                            <option value="250">4 per sec</option>
                                            <option value="500">2 per sec</option>
                                            <option value="1000">1 per sec</option>
                                            <option value="2000">1/2 per sec</option>
                                        </select>
                                    </div>
                                </td>
                                <td className='separator'></td>
                                <td>
                                    <div className='select'>
                                        <label><i className="fa fa-question-circle" onClick={openModalDepth}></i> Depth</label>
                                        <select value={configState.depth} onChange={handleDepth}>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <input
                    type="radio"
                    name="radio"
                    id="radio2"
                    onChange={() => handleSelection('tab2')}
                />
                <div className="tab2">
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <div className='select'>
                                        <label><i className="fa fa-question-circle" onClick={openModalCapModule}></i> Cap Module</label>
                                        <select value={configState.reduceIterations} onChange={handleReduceIterations}>
                                            <option value="true">Sí</option>
                                            <option value="false">No</option>
                                        </select>
                                    </div>
                                </td>
                                <td className='separator'></td>
                                <td>
                                    <div className='select'>
                                        <label>Show Ascii</label>
                                        <select value={configState.showAscii} onChange={handleShowAscii}>
                                            <option value="true">Sí</option>
                                            <option value="false">No</option>
                                        </select>
                                    </div>
                                </td>
                                <td className='separator'></td>
                                <td>
                                    <div className='select'>
                                        <label><i className="fa fa-question-circle" onClick={openModalDebugMode}></i> Debug Mode</label>
                                        <select value={configState.debugMode} onChange={handleDebugMode}>
                                            <option value="true">Sí</option>
                                            <option value="false">No</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <input
                    type="radio"
                    name="radio"
                    id="radio3"
                    onChange={() => handleSelection('tab3')}
                />
                <div className="tab3">
                    <h3>{numMovements}</h3>
                    <p>{joinedHistory}</p>
                </div>

                <input
                    type="radio"
                    name="radio"
                    id="radio4"
                    onChange={() => handleSelection('tab4')}
                />
                <div className="tab4">
                    <h2>Work in progress...</h2>
                    <p></p>
                </div>
            </div>

            <Modal ref={modalRefUpdateFreq}>
                <p>Shows X final positions per second on module chessboard.</p>
            </Modal>

            <Modal ref={modalRefDepth}>
                <p>The module will search for deeper number of positions and this will make it work slowly but accurately.</p>
            </Modal>

            <Modal ref={modalRefCapModule}>
                <p>This option cuts randomly move options making the module faster but with the lack of accuracy.</p>
            </Modal>

            <Modal ref={modalRefDebugMode}>
                <p>xxx.</p>
            </Modal>
        </div>
    );
}