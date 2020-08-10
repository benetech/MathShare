import React from 'react';

const DynamicSVG = ({ name, ...rest }) => {
    const ImportedIconRef = React.useRef(null);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        setLoading(true);
        const importIcon = async () => {
            try {
                ImportedIconRef.current = (await import(`../../../images/${name}.svg`)).default;
                console.log('ImportedIconRef', ImportedIconRef);
            } catch (err) {
                // Your own error handling logic, throwing error for the sake of
                // simplicity
                throw err;
            } finally {
                setLoading(false);
            }
        };
        importIcon();
    }, [name]);

    if (!loading && ImportedIconRef.current) {
        const { current } = ImportedIconRef;

        return <img src={current} alt="" {...rest} />;
    }

    return null;
};
export default DynamicSVG;
