import { UseMutateFunction, useMutation, useQueryClient } from 'react-query';

import { Appointment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';

// for when server call is needed
async function removeAppointmentUser(appointment: Appointment): Promise<void> {
  const patchData = [{ op: 'remove', path: '/userId' }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

// TODO: update return type
// export function useCancelAppointment(): (appointment: Appointment) => void {
export function useCancelAppointment(): UseMutateFunction<
  void,
  unknown,
  Appointment,
  unknown
> {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  // TODO: replace with mutate function
  const { mutate } = useMutation(removeAppointmentUser, {
    // nothing to see here
    onSuccess: () => {
      queryClient.invalidateQueries([queryKeys.appointments]);
      toast({
        title: 'You have cancelled the appointment',
        status: 'warning',
      });
    },
  });
  return mutate;
}
