import React from 'react';
import config from '../config';

export const Info = ({ onSelectTab, onChangeBoardOrientation, onChangeUpdateFreq, configState, onChangeDepth, onChangeReduceIterations, onChangeShowAscii }) => {

    const handleSelection = (selectedOption) => {
        onSelectTab(selectedOption);
    };

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
    return (
        <div className="container">
            <div className="lbl-menu">
                <label htmlFor="radio1">Configuration</label>
                <label htmlFor="radio2">Advanced Configuration</label>
                <label htmlFor="radio3">XXXXXX</label>
                <label htmlFor="radio4">XXXXXX</label>
            </div>

            <div className="content">
                <input
                    type="radio"
                    name="radio"
                    id="radio1"
                    defaultChecked
                    onChange={() => handleSelection('Inicio')}
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
                                    <label>Update Frequency</label>
                                    <select value={configState.updateFreq} onChange={handleUpdateFreq}>
                                        <option value="50">20 por segundo</option>
                                        <option value="100">10 por segundo</option>
                                        <option value="250">4 por segundo</option>
                                        <option value="500">2 por segundo</option>
                                        <option value="1000">1 por segundo</option>
                                        <option value="2000">1/2 por segundo</option>
                                    </select>
                                </div>
                            </td>
                            <td className='separator'></td>
                            <td>
                                <div className='select'>
                                    <label>Depth</label>
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
                    onChange={() => handleSelection('Servicio')}
                />
                <div className="tab2">
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                <div className='select'>
                                    <label>Cap Module</label>
                                    <select value={configState.depth} onChange={handleDepth}>
                                        <option value="true">Sí</option>
                                        <option value="false">No</option>
                                    </select>
                                </div>
                            </td>
                            <td className='separator'></td>
                            <td>
                                <div className='select'>
                                    <label>Show Ascii</label>
                                    <select value={configState.depth} onChange={handleDepth}>
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
                    onChange={() => handleSelection('Blog')}
                />
                <div className="tab3">
                    <h2>Work in progress...</h2>
                    <p></p>
                </div>

                <input
                    type="radio"
                    name="radio"
                    id="radio4"
                    onChange={() => handleSelection('Contacto')}
                />
                <div className="tab4">
                    <h2>Work in progress...</h2>
                    <p></p>
                </div>
            </div>
        </div>
    );
}