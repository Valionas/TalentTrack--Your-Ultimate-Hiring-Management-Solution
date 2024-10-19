import React, { useState } from 'react';
import { TextField, Box, Chip, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

interface SkillsInputProps {
  skills: string[];
  setSkills: (skills: string[]) => void;
}

const SkillsInput: React.FC<SkillsInputProps> = ({ skills, setSkills }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleAddSkill = () => {
    if (inputValue && !skills.includes(inputValue)) {
      setSkills([...skills, inputValue]);
      setInputValue(''); // Clear input after adding skill
    }
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    setSkills(skills.filter((skill) => skill !== skillToDelete));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Add Skill"
          variant="outlined"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAddSkill();
              e.preventDefault(); // Prevent form submission if inside a form
            }
          }}
          fullWidth
        />
        <IconButton color="primary" onClick={handleAddSkill}>
          <AddCircleOutlineIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {skills.map((skill, index) => (
          <Chip
            key={index}
            label={skill}
            onDelete={() => handleDeleteSkill(skill)}
            deleteIcon={<DeleteIcon />}
            sx={{ backgroundColor: '#e0e0e0', color: '#000' }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SkillsInput;
