import useStream from '@hooks/useStream';

interface TogglerProps {
  label: string;
  checked: boolean;
  callback: (input: boolean) => void;
}

const Toggler: React.FC<TogglerProps> = ({ label, checked, callback }) => {
  const toggle = () => {
    callback(!checked);
  };

  return (
    <label className="mr-2 relative text-white flex justify-between items-center p2">
      {label}
      <input
        type="checkbox"
        checked={checked}
        onChange={toggle}
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
  const [shouldUseProxy, setProxy] = useStream((store) => [
    store.shouldUseProxy,
    store.setProxy,
  ]);

  const [isDub, setDub] = useStream((store) => [store.isDub, store.setDub]);

  return (
    <div className="flex space-x-4 m-2">
      <Toggler
        label="Use Proxy?"
        checked={shouldUseProxy}
        callback={setProxy}
      />

      <Toggler
        label="Watch Dubbed Version?"
        checked={isDub}
        callback={setDub}
      />
    </div>
  );
};

export default WatchControls;
