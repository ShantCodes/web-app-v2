import { ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  CurrentIdentity,
  Mission,
  MissionStatus,
  Offer,
  acceptOffer,
  cancelMission,
  cancelOffer,
  completeMission,
  dropMission,
  getOffer,
  rejectOffer,
} from 'src/core/api';
import { AlertMessage } from 'src/Nowruz/modules/general/components/alertMessage';
import { FeaturedIcon } from 'src/Nowruz/modules/general/components/featuredIcon-new';
import { RootState } from 'src/store';

import { ContractDetailTab } from '../contractDetailTab';

export const useContractDetailsSlider = (offer: Offer, mission?: Mission) => {
  const identity = useSelector<RootState, CurrentIdentity | undefined>((state) => {
    return state.identity.entities.find((identity) => identity.current);
  });

  const type = identity?.type;
  const name = type === 'users' ? offer.offerer.meta.name : offer.recipient.meta.name;
  const profileImage = type === 'users' ? offer.offerer.meta.image : offer.recipient.meta.avatar;

  const tabs = [
    { label: 'Details', content: <ContractDetailTab offer={offer} /> },
    { label: 'Activity', content: <div /> },
  ];

  const [offerStatus, setOfferStatus] = useState(offer.status);
  const [missionStatus, setmissionStatus] = useState<MissionStatus | undefined>(mission?.status);
  const [displayMessage, setDisplayMessage] = useState(false);
  const [message, setMessage] = useState<ReactNode>();
  const [displayPrimaryButton, setDisplayPrimaryButton] = useState(false);
  const [displaySecondaryButton, setDisplaySecondaryButton] = useState(false);
  const [primaryButtonLabel, setPrimaryButtonLabel] = useState('');
  const [secondaryButtonLabel, setSecondaryButtonLabel] = useState('');
  const [primaryButtonAction, setPrimaryButtonAction] = useState<() => void>();
  const [secondaryButtonAction, setSecondaryButtonAction] = useState<() => void>();
  const [openAlert, setOpenAlert] = useState(false);
  const [handleAlertSubmit, setHandleAlertSubmit] = useState<() => void>();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertIcon, setAlertIcon] = useState<ReactNode>();
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [paymentOffer, setPaymentOffer] = useState<Offer>();

  const setAllStates = (
    displayMsg: boolean,
    msg: ReactNode | null,
    displayPrimaryBtn: boolean,
    primaryBtnLabel: string,
    displaySecondaryBtn: boolean,
    secondaryBtnLabel: string,
    primaryBtnAction?: () => void,
    secondaryBtnAction?: () => void,
  ) => {
    setDisplayMessage(displayMsg);
    setMessage(msg);
    setDisplayPrimaryButton(displayPrimaryBtn);
    setPrimaryButtonLabel(primaryBtnLabel);
    setPrimaryButtonAction(() => primaryBtnAction);
    setDisplaySecondaryButton(displaySecondaryBtn);
    setSecondaryButtonLabel(secondaryBtnLabel);
    setSecondaryButtonAction(() => secondaryBtnAction);
  };

  const inititalize = () => {
    if (type === 'users') {
      if (offerStatus === 'PENDING') {
        setAllStates(false, null, true, 'Accept', true, 'Decline', handleAccept, handleDecline);
        return;
      }

      if (offerStatus === 'APPROVED') {
        const alertMsg = (
          <AlertMessage
            theme="primary"
            iconName="check-circle"
            title="You have accepted this offer"
            subtitle={`We are just waiting for the final confirmation from ${name} to start the job.`}
          />
        );
        setAllStates(true, alertMsg, false, '', false, '');
        return;
      }
      if (offerStatus === 'WITHDRAWN') {
        const alertMsg = (
          <AlertMessage theme="gray" iconName="check-circle" title="" subtitle="You have declined this offer" />
        );
        setAllStates(true, alertMsg, false, '', false, '');

        return;
      }

      if (offerStatus === 'HIRED' && missionStatus === 'ACTIVE') {
        const alertMsg = (
          <AlertMessage
            theme="primary"
            iconName="check-circle"
            title="Your job has been confirmed"
            subtitle="Once you have finished your work please click on <b>complete</b> button."
          />
        );
        setAllStates(true, alertMsg, true, 'Complete', true, 'Stop', handleOpenCompleteConfirm, handleStop);
        return;
      }

      if (offerStatus === 'CLOSED' && missionStatus === 'CANCELED') {
        const alertMsg = (
          <AlertMessage theme="gray" iconName="check-circle" title="" subtitle="You have canceled this contract" />
        );
        setAllStates(true, alertMsg, false, '', false, '');
        return;
      }
      if (offerStatus === 'CLOSED' && missionStatus === 'COMPLETE') {
        const alertMsg = (
          <AlertMessage
            theme="warning"
            iconName="alert-circle"
            title="Completion submitted"
            subtitle={`Awaiting confirmation from <b>${name}</b>`}
          />
        );
        setAllStates(true, alertMsg, false, '', false, '');
        return;
      }
    }
    if (type === 'organizations') {
      if (offerStatus === 'APPROVED' && offer.assignment_total) {
        const alertMsg = (
          <AlertMessage
            theme="warning"
            iconName="alert-circle"
            title="Payment required"
            subtitle={`${name} has accepted your offer. Proceed to payment to start this job.`}
          />
        );
        setAllStates(
          true,
          alertMsg,
          true,
          'Proceed to payment',
          true,
          'Withdraw',
          handleOpenPaymentModal,
          withdrawOfferByOP,
        );
        return;
      }
      if (offerStatus === 'HIRED' && offer.assignment_total) {
        const alertMsg = (
          <AlertMessage
            theme="primary"
            iconName="alert-circle"
            title="Payment was done successfully"
            subtitle={`${name} can now start the job`}
          />
        );
        setAllStates(true, alertMsg, false, '', true, 'Stop', undefined, handleStopByOP);
        return;
      }
      if (offerStatus === 'CLOSED' && missionStatus === 'KICKED_OUT') {
        const alertMsg = (
          <AlertMessage theme="gray" iconName="alert-circle" title="You have stopped this contract" subtitle="" />
        );
        setAllStates(true, alertMsg, false, '', false, '');
        return;
      }
      if (offerStatus === 'CANCELED') {
        const alertMsg = (
          <AlertMessage theme="gray" iconName="alert-circle" title="You have canceled this offer" subtitle="" />
        );
        setAllStates(true, alertMsg, false, '', false, '');
        return;
      }
    }

    setAllStates(false, null, false, '', false, '');
  };

  useEffect(() => {
    inititalize();
  }, [offerStatus, missionStatus]);

  const handleAccept = async () => {
    await acceptOffer(offer.id);
    setOfferStatus('APPROVED');
    setmissionStatus(undefined);
  };
  const handleDecline = async () => {
    await rejectOffer(offer.id);
    setOfferStatus('WITHDRAWN');
    setmissionStatus(undefined);
  };

  const handleStop = async () => {
    await cancelMission(mission.id);
    setOfferStatus('CLOSED');
    setmissionStatus('CANCELED');
  };
  const handleOpenCompleteConfirm = () => {
    setAlertTitle('Submit job completion?');
    setAlertIcon(<FeaturedIcon iconName="alert-circle" size="md" theme="warning" type="light-circle-outlined" />);
    setAlertMessage(`Once ${name} confirms the job completion, you will receive your payment.`);
    setHandleAlertSubmit(() => handleComplete);
    setOpenAlert(true);
  };
  const handleComplete = async () => {
    setOpenAlert(false);
    await completeMission(mission.id);
    setOfferStatus('CLOSED');
    setmissionStatus('COMPLETE');
    setOpenAlert(false);
  };

  const handleOpenPaymentModal = async () => {
    const res = await getOffer(offer.id);
    setPaymentOffer(res);

    setOpenPaymentModal(true);
  };

  const handleClosePaymentModal = (paymentSuccess: boolean) => {
    if (paymentSuccess) {
      setOfferStatus('HIRED');
      setmissionStatus('ACTIVE');
    }
    setOpenPaymentModal(false);
  };
  const handleStopByOP = async () => {
    await dropMission(mission.id);
    setOfferStatus('CLOSED');
    setmissionStatus('KICKED_OUT');
  };

  const withdrawOfferByOP = async () => {
    await cancelOffer(offer.id);
    setOfferStatus('CANCELED');
    setmissionStatus(undefined);
  };

  return {
    name,
    profileImage,
    type,
    tabs,
    displayMessage,
    message,
    displayPrimaryButton,
    primaryButtonLabel,
    primaryButtonAction,
    displaySecondaryButton,
    secondaryButtonLabel,
    secondaryButtonAction,
    openAlert,
    setOpenAlert,
    handleAlertSubmit,
    alertIcon,
    alertTitle,
    alertMessage,
    openPaymentModal,
    setOpenPaymentModal,
    handleClosePaymentModal,
    paymentOffer,
  };
};
