// This page is used to declare all the classes and methods that can be used
// across all files in the project.

// Class for a generic person
class Person
{
  constructor(firstName, lastName, email)
  {
    this._firstName = firstName;
    this._lastName = lastName;
    this._email = email;
  }

  // Getter and setter of attributes
  get firstName(){return this._firstName;}
  get lastName(){return this._lastName;}
  get email(){return this._email;}

  set firstName(newFirstName){this._firstName = newFirstName;}
  set lastName(newLastName){this._lastName = newLastName;}
  set email(newEmail){this._email = newEmail;}

  fromData(dataObject){
    this._firstName = dataObject._firstName;
    this._lastName = dataObject._lastName;
    this._email = dataObject._email;
  }
}

// Class for a student
class Student extends Person
{
  constructor(firstName, lastName, email)
  {
    super(firstName, lastName, email);
    this._hasAuthority = false;
  }
}

// CLass for a marker
class Marker extends Person
{
  constructor(firstName, lastName, email)
  {
    super(firstName, lastName, email);
    this._hasAuthority = true;
  }
}

// Class for a group consisting of numerous students
class Group
{
  constructor(groupID, groupName)
  {
    this._groupID = groupID;
    this._groupName = groupName;
    this._members = [];
  }

  // Getter and setters
  get groupName() { return this._groupName; }
  set groupName(newgroupName) { this._groupName = newgroupName; }

  // Adds a new member to the group
  addMember(student)
  {
    this._members.push(student);
  }
}

// Class for a project
class Project
{
  constructor(projectName, taskList)
  {
    this._projectName = projectName;
    this._taskList = taskList;
    this._groupList = [];
    this._gradingScheme = [];
  }

  // Adds a new group that is working on the project
  addgroup(group)
  {
    this.groupList.push(group);
  }

}

// Class for a task which is part of the project
class Task
{
  constructor(taskName)
  {
    this._taskName = taskName;
    this._comments = [];
    this._contributions = [];
  }

  // Getter and setter of tasks
  get taskName(){ return this._taskName; }
  set taskName(newTaskName){ this._taskName = newTaskName; }

  get comments(){ return this._comments; }
  get contributions(){ return this._contributions; }

  // Adds a comment to the task
  addComment(student, comment)
  {
    let newComment = {
      student: student,
      comment: comment
    };
    this._comments.push(newComment);
  }

  // Adds a contribution of a specified student to the task
  addContribution(student, timeSpent)
  {
    let newContribution = {
      student: student,
      timeSpent: timeSpent
    };
    this._contributions.push(newContribution);
  }
}

// Class to group a collection of tasks that are part of a project
class TaskList
{
  constructor()
  {
    this._tasks = [];
  }

  // Adds a task to the list of tasks
  addTasks(newTask)
  {
    this._tasks.push(newTask);
  }
}

// Class to represent the marks that can be assigned to a student, along with
// any additional comments
class Marks()
{
  constructor(student, marks, comment)
  {
    this._student = student;
    this._marks = marks;
    this._comment = comment;
  }
}
