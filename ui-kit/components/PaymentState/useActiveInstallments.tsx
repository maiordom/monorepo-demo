import { useState, useEffect } from 'react';

import { IInstallmentPlan } from 'core/entities/Customer/types/InstallmentPlan';

const updateInstallments = (
  installments: IInstallmentPlan[],
  activeIds: string[]
) => {
  installments.forEach((installment, index) => {
    installment.checked = activeIds.includes(installment.id);
  });
};

export default (installments: IInstallmentPlan[] = []) => {
  const actualIds = installments
    .filter(item => item.checked)
    .map(item => item.id);

  const [activeIds, setActiveIds] = useState(() => actualIds);

  useEffect(() => {
    if (installments.length) {
      updateInstallments(installments, actualIds);
      setActiveIds(actualIds);
    }
  }, [installments]);

  const setActiveIdsById = (id: string) => {
    if (!activeIds.length) return false;

    const availableToClickIds = installments
      .filter(item => !item.isPaid)
      .map(item => item.id);

    const clickedIsAlreadyActive = activeIds.includes(id);
    const forbidToToggle = installments.find(item => !item.isPaid).id === id;

    if (forbidToToggle && availableToClickIds.length === 1) return false;

    let offset = 0;

    if (!clickedIsAlreadyActive || forbidToToggle) {
      offset = 1;
    }

    const result = availableToClickIds.slice(
      0,
      availableToClickIds.indexOf(id) + offset
    );

    updateInstallments(installments, result);
    setActiveIds(result);

    return result;
  };

  return {
    activeInstallmentIds: activeIds,
    setActiveInstallmentIds: setActiveIdsById,
  };
};
