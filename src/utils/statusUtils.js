export const getStatusColor = (status) => {
    switch (status) {
        case 'Pending':
            return 'red'
        case 'In Progress':
            return 'yellow'
        case 'Completed':
            return 'lime'
        default:
            return 'zinc'
    }
}
