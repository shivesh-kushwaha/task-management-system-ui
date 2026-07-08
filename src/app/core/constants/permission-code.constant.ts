// permission-code.constant.ts
export const PermissionCodeConstant = {
    User: {
        AddUser: 'ADD_USER',
        ViewUser: 'VIEW_USER',
        UpdateUser: 'UPDATE_USER',
        DeleteUser: 'DELETE_USER',
    },
    Project: {
        AddProject: 'ADD_PROJECT',
        ViewProject: 'VIEW_PROJECT',
        UpdateProject: 'UPDATE_PROJECT',
        DeleteProject: 'DELETE_PROJECT',
    },
    Team: {
        AddTeam: 'ADD_TEAM',
        ViewTeam: 'VIEW_TEAM',
        UpdateTeam: 'UPDATE_TEAM',
        DeleteTeam: 'DELETE_TEAM',
    },
    WorkItem: {
        AddWorkItem: 'ADD_WORK_ITEM',
        ViewWorkItem: 'VIEW_WORK_ITEM',
        UpdateWorkItem: 'UPDATE_WORK_ITEM',
        DeleteWorkItem: 'DELETE_WORK_ITEM',
    }
} as const;