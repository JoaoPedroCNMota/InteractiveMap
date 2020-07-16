import React, { useEffect } from 'react';
import { Map, TileLayer, Marker, LayersControl, Popup } from 'react-leaflet'
const { BaseLayer } = LayersControl;

const MyMap = () => {

    const [position, setPosition] = React.useState([]);
    const [points, setPoints] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            function (position) {

                setPosition([position.coords.latitude, position.coords.longitude]);
                setLoading(false);
            },
            function (error) {
                alert("Talvez o seu navegador esteja com uma API key inválida.\n Por favor, siga: https://stackoverflow.com/questions/61032115/unknown-error-acquiring-position-geolocationpositionerror-code-2-firefox-linux ");
            }
        );
    }, [])

    const addMarker = (p) => {
        const desc = prompt('Decrição:')
        if (desc) {
            setPoints([...points, {
                id: points.length,
                desc: desc,
                position: p.latlng,
            }]);
        }
    }

    const downloadData = () => {
        const jsonData = JSON.stringify(points);
        const blob = new Blob([jsonData], { type: 'aplication/json' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = href;
        link.download = "points.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div>
            {loading ?
                <p>Carregando...</p>
                :
                <Map center={position} zoom={12} onClick={addMarker}>
                    <LayersControl>
                        <BaseLayer checked name="Padrão ">
                            <TileLayer
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        </BaseLayer>
                        <BaseLayer name="Humanitário">
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                            />
                        </BaseLayer>
                        <BaseLayer name="CyclOSM">
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
                            />
                        </BaseLayer>
                        <BaseLayer name="Preto e Branco">
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
                            />
                        </BaseLayer>
                    </LayersControl>
                    {points.map((point) =>
                        //key = point.id apenas para resolver warning de null;
                        <Marker key={point.id} position={point.position}>
                            <Popup>
                                <span>{point.desc}</span>
                            </Popup>
                        </Marker>
                    )}
                </Map>
            }
            <button className="btnDownload" onClick={downloadData}>Exportar Pontos</button>
        </div>
    )
}

export default MyMap;