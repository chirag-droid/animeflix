import { AnyAction } from '@reduxjs/toolkit';

import { toggleDub, toggleProxy } from '@store/slices/videoSettings';
import { useDispatch, useSelector } from '@store/store';

interface TogglerProps {
  label: string;
  checked: boolean;
  action: AnyAction;
}

const Toggler: React.FC<TogglerProps> = ({ label, checked, action }) => {
  const dispatch = useDispatch();

  return (
    <label className="mr-2 relative text-white flex justify-between items-center p2">
      {label}
      <input
        type="checkbox"
        checked={checked}
        onChange={() => dispatch(action)}
        className="absolute left-0 top-0 w-full h-full peer appearance-none"
      />
      <span
        className={`
                  w-9 h-5 flex items-center flex-shrink-0 bg-gray-300
                  ml-2 p-1 rounded-full
                  after:w-4 after:h-4 after:bg-gray-500 after:rounded-full after:shadow-lg
                  peer-checked:bg-red-500 peer-checked:after:bg-gray-800 peer-checked:after:translate-x-3 after:duration-300
                `}
      />
    </label>
  );
};

const WatchControls: React.FC = () => {
  const [useProxy, useDub] = useSelector((store) => [
    store.videoSettings.useProxy,
    store.videoSettings.useDub,
  ]);

  return (
    <div className="flex space-x-4 m-2">
      <Toggler label="Use Proxy?" checked={useProxy} action={toggleProxy()} />
      <Toggler label="Watch Dubbed?" checked={useDub} action={toggleDub()} />
    </div>
  );
};

export default WatchControls;
