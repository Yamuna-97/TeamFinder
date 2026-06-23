export const matchSkills = (studentSkills, projectSkills) => {
  if (!studentSkills || !projectSkills) return { matched: [], missing: [], matchPercentage: 0 }
  
  const matched = []
  const missing = []
  
  projectSkills.forEach(projectSkill => {
    const studentSkill = studentSkills.find(
      s => s.skillName.toLowerCase() === projectSkill.skillName.toLowerCase()
    )
    
    if (studentSkill) {
      matched.push({
        skillName: projectSkill.skillName,
        requiredLevel: projectSkill.requiredLevel,
        studentLevel: studentSkill.skillLevel,
        isMatch: getSkillLevelValue(studentSkill.skillLevel) >= getSkillLevelValue(projectSkill.requiredLevel)
      })
    } else {
      missing.push({
        skillName: projectSkill.skillName,
        requiredLevel: projectSkill.requiredLevel
      })
    }
  })
  
  const matchPercentage = Math.round((matched.length / projectSkills.length) * 100)
  
  return { matched, missing, matchPercentage }
}

const getSkillLevelValue = (level) => {
  switch (level) {
    case 'Beginner': return 1
    case 'Intermediate': return 2
    case 'Advanced': return 3
    default: return 0
  }
}

export const getRecommendedProjects = (student, projects) => {
  if (!student || !projects) return []
  
  return projects
    .filter(project => {
      // Check year eligibility
      if (student.year < project.minimumYear || student.year > project.maximumYear) {
        return false
      }
      
      // Check if project is recruiting
      if (project.status !== 'Recruiting') {
        return false
      }
      
      return true
    })
    .map(project => {
      const matchResult = matchSkills(student.skills, project.skills)
      return {
        ...project,
        matchPercentage: matchResult.matchPercentage,
        matchedSkills: matchResult.matched.length,
        totalRequiredSkills: project.skills ? project.skills.length : 0
      }
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
}