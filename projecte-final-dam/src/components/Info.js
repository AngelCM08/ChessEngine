import React from 'react';
import config from '../config';

export const Info = ({ onSelectTab, onChangeBoardOrientation, onChangeUpdateFreq, configState }) => {

    const handleSelection = (selectedOption) => {
        onSelectTab(selectedOption);
    };

    const handleBoardOrientation = (selectedOption) => {
        onChangeBoardOrientation(selectedOption);
    };

    const handleUpdateFreq = (selectedOption) => {
        onChangeUpdateFreq(selectedOption);
    };

    return (
        <div className="container">
            <div className="lbl-menu">
                <label htmlFor="radio1">Configuration</label>
                <label htmlFor="radio2">Servicio</label>
                <label htmlFor="radio3">Blog</label>
                <label htmlFor="radio4">Contacto</label>
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
                            <td>
                                <div className='select'>
                                    <label>Update Frequency</label>
                                    <select value={configState.updateFreq} onChange={handleUpdateFreq}>
                                        <option value="100">100 ms</option>
                                        <option value="250">250 ms</option>
                                        <option value="500">500 ms</option>
                                        <option value="750">750 ms</option>
                                        <option value="1000">1000 ms</option>
                                        <option value="1500">1500 ms</option>
                                        <option value="2000">2000 ms</option>
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
                    <div className='select'>
                        <label>Board Orientation</label>
                        <select value={config.boardOrientation} onChange={handleBoardOrientation}>
                            <option value="white">White</option>
                            <option value="black">Black</option>
                        </select>
                    </div>
                </div>

                <input
                    type="radio"
                    name="radio"
                    id="radio3"
                    onChange={() => handleSelection('Blog')}
                />
                <div className="tab3">
                    <h2>Blog</h2>
                    <p></p>
                </div>

                <input
                    type="radio"
                    name="radio"
                    id="radio4"
                    onChange={() => handleSelection('Contacto')}
                />
                <div className="tab4">
                    <h2>Contacto</h2>
                    <p></p>
                </div>
            </div>
        </div>
    );
}