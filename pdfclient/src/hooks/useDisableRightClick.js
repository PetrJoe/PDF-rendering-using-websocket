import { useEffect } from 'react';

const useDisableRightClick = () => {
    useEffect(() => {
        const disableRightClick = (event) => {
            event.preventDefault();
        };

        document.addEventListener('contextmenu', disableRightClick);

        return () => {
            document.removeEventListener('contextmenu', disableRightClick);
        };
    }, []);
};

export default useDisableRightClick;
