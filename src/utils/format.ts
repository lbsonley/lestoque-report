export const formatDate = (date: Date) => {
	const formattedDay =
		`${date.getDate()}`.length < 2 ? `0${date.getDate()}` : date.getDate();

	return `${date.getFullYear()}-${date.getMonth() + 1}-${formattedDay}`;
};

export const round = (num: number) => {
	return Math.round((num + Number.EPSILON) * 100) / 100;
};
