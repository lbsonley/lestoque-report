export const formatDate = (date: Date) => {
	const formattedDay =
		`${date.getDate()}`.length < 2 ? `0${date.getDate()}` : date.getDate();
	const formattedMonth =
		`${date.getMonth() + 1}`.length < 2
			? `0${date.getMonth() + 1}`
			: `${date.getMonth() + 1}`;

	return `${date.getFullYear()}-${formattedMonth}-${formattedDay}`;
};

export const round = (num: number) => {
	return Math.round((num + Number.EPSILON) * 100) / 100;
};
