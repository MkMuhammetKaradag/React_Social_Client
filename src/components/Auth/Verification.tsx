import { useMutation } from '@apollo/client';
import { FC, useRef, useState, ChangeEvent } from 'react';
import { VscWorkspaceTrusted } from 'react-icons/vsc';
import { ACTIVATION_USER } from '../../graphql/mutations/Activation';
import styles from '../../utils/styles';

type Props = {
  setActiveState: (route: string) => void;
};

type VerifyNumber = Record<string, string>;

const Verification: FC<Props> = ({ setActiveState }) => {
  const [activateUser, { loading }] = useMutation(ACTIVATION_USER);
  const [invalidError, setInvalidError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputRefs = Array(4)
    .fill(null)
    .map(() => useRef<HTMLInputElement>(null));

  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: '',
    1: '',
    2: '',
    3: '',
  });

  const verificationHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join('');
    const activationToken = localStorage.getItem('activationToken');

    if (verificationNumber.length !== 4) {
      setInvalidError(true);
      setErrorMessage('Please enter a 4-digit verification code.');
      return;
    }

    try {
      await activateUser({
        variables: {
          input: {
            activationToken,
            activationCode: verificationNumber,
          },
        },
      });
      localStorage.removeItem('activation_token');
      setActiveState('Login');
    } catch (error: any) {
      console.error('Activation Error:', error);
      setErrorMessage(
        error.graphQLErrors?.[0]?.message ||
          'An error occurred during activation.'
      );
    }
  };

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    setErrorMessage(null);

    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newVerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    if (value === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const isVerifyButtonDisabled =
    Object.values(verifyNumber).some((value) => value === '') || loading;

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className={`${styles.title}`}>Verify Your Account</h1>

      <div className="w-full flex items-center justify-center mt-2">
        <div className="w-[80px] h-[80px] rounded-full bg-[#F02C56] flex items-center justify-center">
          <VscWorkspaceTrusted size={40} />
        </div>
      </div>

      <div className="m-auto flex items-center justify-around mt-8">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            type="text"
            inputMode="numeric"
            key={key}
            ref={inputRefs[index]}
            className={`w-[65px] h-[65px] bg-transparent border-[3px] rounded-[10px] flex items-center text-black justify-center text-[18px] font-Poppins outline-none text-center ${
              invalidError ? 'shake border-red-500' : 'border-gray-600'
            }`}
            placeholder=""
            maxLength={1}
            value={verifyNumber[key]}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange(index, e.target.value)
            }
            aria-label={`Verification digit ${index + 1}`}
          />
        ))}
      </div>

      {errorMessage && (
        <p className="text-red-500 text-center mt-4">{errorMessage}</p>
      )}

      <div className="w-full flex justify-center mt-8">
        <button
          className={`w-full text-[17px] font-semibold text-white py-3 cursor-pointer rounded-sm ${
            isVerifyButtonDisabled ? 'bg-gray-200' : 'bg-[#F02C56]'
          }`}
          disabled={isVerifyButtonDisabled}
          onClick={verificationHandler}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </div>
    </div>
  );
};

export default Verification;
